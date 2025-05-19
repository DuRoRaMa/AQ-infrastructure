<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useQuery, useSubscription } from '@vue/apollo-composable';
import InProgressRaw from '@/components/TabloPage/InProgressRaw.vue';
import HeaderPanel from '@/components/TabloPage/HeaderPanel.vue';
import { type tabloTalons, TABLO_STATUS } from '@/queries/tabloTalons';
import { type talonLogs, TALON_LOG_SUB } from '@/queries/talonLogSub';

const talonsPerCol = 7;
interface Talon {
  id: number;
  name: string;
  location: string;
}

const data = reactive({ talons: [] as Talon[], lastTalonLogId: -1 });
const data_for_show = reactive([] as { name: string | undefined; location: string }[]);
const active_locations = reactive([] as string[]);
const tablo_status_enabled = ref(false);
const tablo_status = useQuery(
  TABLO_STATUS,
  {},
  { fetchPolicy: 'network-only', enabled: tablo_status_enabled }
);
const { result } = useSubscription(TALON_LOG_SUB, {}, { fetchPolicy: 'network-only' });
const currentNotification = reactive({ name: 'З - 01', location: '14', show: false });
let queueForNotification: Talon[] = [];
// res -> queue -> setinterval -> pop from queue -> show -> setInterval check if somethins show -> cycle
setInterval(() => {
  if (!currentNotification.show) {
    showNotification();
  }
}, 1000);
tablo_status.onResult((res) => {
  if (res.loading) return null;
  let tablo_talons: tabloTalons[] = res.data.tabloTalons;

  for (const talon of tablo_talons) {
    const assigned_logs = talon.logs.filter((x: any) => x.action === 'Assigned');
    const created_by = assigned_logs.at(-1).createdBy;
    const place = created_by.operatorSettings.location?.name;
    data.talons.push({ id: talon.id, name: talon.name, location: place });
  }
  data.talons.sort((a, b) => Number(a.location) - Number(b.location));

  data.lastTalonLogId = res.data.lastTalonLog.id;
});
function showNotification() {
  let notif = queueForNotification.shift();
  if (notif) {
    currentNotification.name = notif.name;
    currentNotification.location = notif.location;
    currentNotification.show = true;
    fetch('http://localhost:8001/tts', {
      method: 'POST',
      body: JSON.stringify(notif),
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Access-Control-Allow-Origin': '*'
      }
    });
    setTimeout(() => {
      currentNotification.show = false;
    }, 10000);
  }
}
watch(
  result,
  (res) => {
    const log: talonLogs = res.talonLogs;
    switch (log.action) {
      case 'Assigned':
        // eslint-disable-next-line no-case-declarations
        const talon: Talon = {
          id: log.talon.id,
          name: log.talon.name,
          location: log.createdBy.operatorSettings!.location.name
        };
        queueForNotification.push(talon);
        if (log.id > data.lastTalonLogId) {
          data.talons.unshift(talon);
        }
        break;
      case 'Completed':
        data.talons.splice(
          data.talons.findIndex((x) => x.id === log.talon.id),
          1
        );
        break;
      case 'Cancelled':
        data.talons.splice(
          data.talons.findIndex((x) => x.id === log.talon.id),
          1
        );
        break;
      default:
        break;
    }
    if (log.id > data.lastTalonLogId) data.lastTalonLogId = log.id;
  },
  { immediate: false }
);
watch(data, () => {
  data_for_show.length = 0;
  let locs = active_locations.slice(0, active_locations.length);

  for (const tal of data.talons) {
    if (tal.location) {
      data_for_show.push(tal);
      let ind = locs.indexOf(tal.location);
      if (ind === -1) {
        active_locations.push(tal.location);
        continue;
      }
      locs.splice(ind, 1);
    }
  }

  for (const loc of locs) {
    data_for_show.push({ name: undefined, location: loc });
  }

  data_for_show.sort((a, b) => Number(a.location) - Number(b.location));
});
onMounted(() => {
  fetch(import.meta.env.VITE_API_URL + '/queue/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (response) => {
    for (const loc of (await response.json()).locations) {
      if (loc.settings !== null) {
        active_locations.push(loc.name);
      }
    }
    tablo_status_enabled.value = true;
  });
});
</script>
<template>
  <div style="margin: 32px">
    <HeaderPanel></HeaderPanel>
    <div class="hor-line"></div>
    <div class="up-ver-line"></div>
    <div class="down-hor-line"></div>
    <p
      style="
        position: absolute;
        bottom: 4%;
        left: 10%;
        font-size: 28px;
        font-family: 'Unbounded-Bold';
        color: #1d3d84;
      "
    >
      Удачи<br />
      при поступлении!
    </p>
    <div class="columns has-text-centered">
      <div class="column">
        <div class="columns is-multiline" style="padding: 1%">
          <div class="column is-full" style="padding-left: 60px; padding-top: 10px">
            <div v-if="currentNotification.show">
              <p style="font-size: 4em; color: black; font-family: 'HeliosC'; font-weight: 700">
                Талон
              </p>
              <p style="font-size: 7em; color: #1d3d84; font-family: 'HeliosC'; font-weight: 700">
                {{ currentNotification.name }}
              </p>
              <p
                style="
                  font-size: 5em;
                  line-height: 90px;
                  font-family: 'HeliosC';
                  color: black;
                  font-weight: 700;
                "
              >
                стол
              </p>
              <p
                style="
                  font-size: 6em;
                  line-height: 90px;
                  font-family: 'HeliosC';
                  color: black;
                  font-weight: 700;
                "
              >
                {{ currentNotification.location }}
              </p>
            </div>
            <img
              src="@/assets/DVFU_logo_tablo.svg"
              alt=""
              style="
                max-height: 350px;
                position: absolute;
                bottom: 3%;
                left: 5%;
                transform: scale(0.8);
              "
            />
          </div>
        </div>
      </div>
      <div class="column is-two-thirds">
        <div class="columns is-multiline" style="padding: 1%">
          <div class="column">
            <div class="columns is-multiline is-gapless">
              <div class="column is-three-fifths">
                <p style="font-family: HeliosC; font-size: 30px; font-weight: 800; color: black">
                  Талон
                </p>
              </div>
              <div class="column is-one-fifths"></div>
              <div class="column is-one-fifths">
                <p style="font-family: HeliosC; font-size: 30px; font-weight: 800; color: black">
                  Стол
                </p>
              </div>
              <InProgressRaw
                v-for="talon in data_for_show.slice(0, talonsPerCol)"
                :talon="talon"
                :key="talon.location"
              />
            </div>
          </div>
          <div class="column">
            <div class="columns is-multiline is-gapless">
              <div class="column is-three-fifths">
                <p style="font-family: HeliosC; font-size: 30px; font-weight: 800; color: black">
                  Талон
                </p>
              </div>
              <div class="column is-one-fifths"></div>
              <div class="column is-one-fifths">
                <p style="font-family: HeliosC; font-size: 30px; font-weight: 800; color: black">
                  Стол
                </p>
              </div>
              <InProgressRaw
                v-for="talon in data_for_show.slice(talonsPerCol)"
                :talon="talon"
                :key="talon.location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.hor-line {
  border-bottom: 3px solid #f5f7fb;
  width: calc(100% - 64px);
  margin-left: 40px;
}
.up-ver-line {
  border-right: 3px solid #f5f7fb;
  height: 80vh;
  margin-top: 40px;
  position: absolute;
  left: 36%;
}
.down-hor-line {
  border-bottom: 3px solid #f5f7fb;
  position: absolute;
  width: 30%;
  bottom: 18%;
  left: 4%;
}
html {
  overflow: hidden;
}
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>

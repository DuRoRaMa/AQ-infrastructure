pipeline {
    agent any
    environment {
        // Настройки репозиториев
        FRONTEND_REPO = "https://github.com/your/frontend-repo.git"
        BACKEND_REPO = "https://github.com/your/backend-repo.git"
        
        // Docker Compose файлы
        BACKEND_COMPOSE = "docker-compose.dvfu.yaml"
        FRONTEND_COMPOSE = "docker-compose.dvfu.yml"
        
        // Credentials
        BACKEND_CREDS = credentials('backend-env')
        FRONTEND_CREDS = credentials('frontend-env')
        
        // Доменные настройки
        DOMAIN = "aq.dvfu.ru"
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }
    stages {
        // Этап 1: Подготовка окружения
        stage('Prepare Environment') {
            steps {
                sh '''
                mkdir -p backend frontend
                docker network create aq-proxy || true
                '''
            }
        }
        
        // Этап 2: Клонирование репозиториев
        stage('Checkout Code') {
            steps {
                dir('backend') {
                    git url: BACKEND_REPO, branch: 'main'
                    writeFile file: '.env.dvfu', text: BACKEND_CREDS
                }
                dir('frontend') {
                    git url: FRONTEND_REPO, branch: 'main'
                    writeFile file: '.env.production', text: FRONTEND_CREDS
                }
            }
        }
        
        // Этап 3: Сборка и тестирование бэкенда
        stage('Backend Build & Test') {
            steps {
                dir('backend') {
                    sh """
                    docker-compose -f $BACKEND_COMPOSE build --no-cache --parallel
                    docker-compose -f $BACKEND_COMPOSE run --rm backend make migrate
                    docker-compose -f $BACKEND_COMPOSE run --rm backend pytest
                    """
                }
            }
        }
        
        // Этап 4: Сборка и тестирование фронтенда
        stage('Frontend Build & Test') {
            environment {
                NODE_OPTIONS = "--max_old_space_size=4096"
            }
            steps {
                dir('frontend') {
                    sh '''
                    pnpm install --frozen-lockfile
                    pnpm run lint
                    pnpm run type-check
                    pnpm run build
                    pnpm run test:unit
                    pnpm audit --prod
                    '''
                }
            }
        }
        
        // Этап 5: Деплой
        stage('Deploy') {
            steps {
                script {
                    // Запуск бэкенда
                    dir('backend') {
                        sh """
                        docker-compose -f $BACKEND_COMPOSE up -d pgdb redis
                        sleep 10 # Ожидание инициализации БД
                        docker-compose -f $BACKEND_COMPOSE up -d --build
                        """
                    }
                    
                    // Запуск фронтенда
                    dir('frontend') {
                        sh "docker-compose -f $FRONTEND_COMPOSE up -d --build"
                    }
                }
            }
        }
        
        // Этап 6: Валидация
        stage('Validation') {
            steps {
                script {
                    // Проверка здоровья бэкенда
                    sh """
                    curl -sSf http://$DOMAIN/api/healthcheck \
                    -H "Host: $DOMAIN" \
                    -o /dev/null --retry 3 --retry-delay 5
                    """
                    
                    // Проверка фронтенда
                    sh """
                    curl -sSf http://$DOMAIN \
                    -H "Host: $DOMAIN" \
                    -o /dev/null --retry 3 --retry-delay 5
                    """
                }
            }
        }
    }
    post {
        always {
            // Очистка ресурсов
            script {
                dir('backend') {
                    sh "docker-compose -f $BACKEND_COMPOSE down"
                }
                cleanWs()
            }
        }
        success {
            slackSend(
                channel: '#deployments',
                message: ":rocket: Успешный деплой ${DOMAIN} (Build ${BUILD_NUMBER})",
                color: 'good'
            )
        }
        failure {
            slackSend(
                channel: '#alerts',
                message: ":fire: Сбой сборки ${JOB_NAME} #${BUILD_NUMBER}",
                color: 'danger'
            )
            emailext (
                subject: "Сбой CI/CD: ${JOB_NAME} #${BUILD_NUMBER}",
                body: """
                Детали сборки: ${BUILD_URL}
                Причина: ${currentBuild.currentResult}
                """,
                to: 'devops@example.com'
            )
        }
        cleanup {
            // Очистка Docker
            sh 'docker system prune -af --volumes'
        }
    }
}

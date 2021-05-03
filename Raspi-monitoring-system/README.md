
# 구성 환경

- 작성 날짜 : 21-04-30

- 보드 : raspi 4B (8GB)
- OS : raspbian buster lite (21-03-04)

- mosquitto (1.5.7 version)
- influxDB (1.8.5 version)
- node-red (1.3.4 version)
    - nodejs (12.22.1 version)
- grafana

# 아키텍쳐

- ppt 참고

# raspi 4B 기초 세팅

- OS(raspbian buster lite)가 삽입된 raspi 4B 준비

- raspi 4B 초기 설정
    - $ sudo raspi-config
        - 1-3. 'pi' user 패스워드 변경
        - 5-1. 지역정보 변경
            - en_GB(UTF-8), en_US(UFT-8), ko_KR(UTF-8), ko_KR(EUC) 를 스페이스 바로 선택 후, Enter
            - default로 ko_KR(UTF-8) 설정
        - 5-2. 시간정보 변경
            - Asia -> Seoul 선택
        - 5-3. keyboard 선택
            - Generic 105-key (Intl) PC -> Other -> Korean -> Korean-Korean(101-104 key compatible) -> The default for the keyboard layout -> No compose key 선택

- apt update && apt upgrade 및 한글 설치
    - $ sudo apt update && sudo apt upgrade
    - $ sudo apt install fonts-nanum
    - $ sudo reboot
 
# 서비스 구축

## Mqtt install

- mosquitto(mqtt lib) intall and configure
    - $ sudo apt install mosquitto mosquitto-clients    # 설치
    - $ echo "mqtt_username:mqtt_password" > pwfile     # id pw 파일 생성
    - $ cat pwfile                      # id pw 확인
    - $ mosquitto_passwd -U pwfile      # pw 암호화
    - $ cat pwfile                      # id pw 확인
    - $ sudo mv pwfile /etc/mosquitto/  # 파일 이동
    - $ sudo nano /etc/mosquitto/mosquitto.conf     # 설정 수정
        - ```
            ...
            log_dest ~
            
            # 추가
            allow_anonymous false
            password_file /etc/mosquitto/pwfile
            
            include ~
          ```
    - $ sudo /etc/init.d/mosquitto restart      # 재시작
    - $ mosquitto_sub -v -t "#"                 # 익명 접근 가능한지 확인(Connection Refused: not authorised)
    - $ mosquitto_sub -v -u mqtt_username -P mqtt_password -t "#"               # 유저로 접근 가능한지 확인(데이터 받는게 없으면 아무 표출 X)

## influxdb install and config

- $ wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -

- $ echo "deb https://repos.influxdata.com/debian buster stable" | sudo tee /etc/apt/sources.list.d/influxdb.list

- $ sudo apt update

- $ sudo apt install influxdb

- $ sudo systemctl unmask influxdb

- $ sudo systemctl enable influxdb

- $ sudo systemctl start influxdb

- $ influx
    - $ CREATE USER admin WITH PASSWORD 'adminpassword' WITH ALL PRIVILEGES
    - $ exit
- $ sudo nano /etc/influxdb/influxdb.conf
    - Searching Word "http" ([ctrl+w] 누르고 http 입력)
        - ```
            [http]
            # 추가
            auth-enabled = true
            pprof-enabled = true
            pprof-auth-enabled =true
            ping-auth-enabled = true
        ```

- $ sudo systemctl restart influxdb

- $ influx -username admin -password adminpassword
    - $ CREATE DATABASE sensors
    - $ exit

## node-red install and config

- $ sudo apt install build-essential git

- $ bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)
    - y, y

- $ sudo systemctl enable nodered.service

- $ sudo systemctl start nodered.service

## grafana install and config

- $ wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -

- $ echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

- $ sudo apt update 

- $ sudo apt install grafana

- $ sudo systemctl enable grafana-server

- $ sudo systemctl start grafana-server

## mqtt client 프로그램 제작 및 실행 (windows 등 client)

- node.js 설치 (인터넷 참조)
    - $ node -v     # nodejs 버전 확인
    - $ npm -v      # npm 버전 확인

- $ cd /Raspi-monitoring-system/mqtt-clinet 

- $ npm install mqtt

- $ node mqtt.js

## mqtt broker 데이터 수신 확인 (raspi 4B)

- mosquitto_sub -u mqtt_username -P mqtt_password -v -t "#"

## node-red programming

- 동영상 참조
    - https://www.youtube.com/watch?v=ffg3_1AgtyA&t=10s
    - 13:23 ~

## grafana setting

- 동영상 참조
    - https://www.youtube.com/watch?v=ffg3_1AgtyA&t=10s
    - 28:51 ~

## 

# 고려해볼만한 추가 작업

- raspi 4B 자동로그인

- raspi 부팅 최적화
    - 부팅 로그 제거
    - 안쓰는 드라이버(서비스) disable
    - 등


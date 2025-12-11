#!/bin/bash

# 에러 발생 시 즉시 종료하지 않음 (대기해야 하니까)
# $MYSQL_HOST와 $MYSQL_PORT는 docker-compose에서 받아옵니다.

echo "Waiting for MySQL to start..."

# nc(netcat) 명령어로 DB가 응답할 때까지 무한 루프
# -z: 데이터 전송 없이 포트만 스캔
while ! nc -z $MYSQL_IP $MYSQL_PORT; do
  sleep 1 # 1초 대기 (부하 없음)
  echo "MySQL is not ready yet..."
done

echo "MySQL is up - executing command"
# 원래 실행하려던 명령어(runserver)를 실행
exec "$@"

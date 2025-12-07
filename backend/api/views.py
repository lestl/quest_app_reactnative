from .models import quest
from .serializer import QuestSerializer
from rest_framework import response
from rest_framework.decorators import api_view
from rest_framework import request
# Create your views here.

#연습을 위해 함수형식으로 사용 차후에 Generic 방식으로도 수정해서 해보자
#메인 리스트 페이지 - RESTFUL 개편
@api_view(['GET', 'POST'])
def quest_json(request):
        if request.method == 'GET':
            quests = quest.objects.all() # 모든 퀘스트 데이터를 가져옴 즉 수정 대상
            serializer = QuestSerializer(quests, many=True) # JSON 직렬화
            try:
                return response.Response(serializer.data, status=200)
            #200은 status 조회 OK
            except Exception as e:
                return response.Response(str("메인오류" + e), status=500)
        #CREATE QUEST
        if request.method == 'POST':
            serializer = QuestSerializer(data=request.data)
            print(serializer)
            if serializer.is_valid():
                try:
                    serializer.save() # 데이터베이스에 저장
                    return response.Response(serializer.data, status=201)
                #201은 status CREATED
                except Exception as e:
                    return response.Response(str(e), status=500)
            return response.Response(serializer.errors, status=400)


#RUD 페이지 및 GET - RESTFUL 개편
@api_view(['GET','DELETE', 'PUT', 'PATCH'])
def quest_fetch(request, id):
    #ID 값으로 데이터 filter
    try:
        targetQuest = quest.objects.get(id=id)
    except Exception as e:
        return response.Response(str(e),status=404)
    
    #GET QUEST
    if request.method == 'GET':
        #변수명이랑 뒤 객체명 다르게 하기
        serializer = QuestSerializer(targetQuest)
        try:
            return response.Response(serializer.data, status=200)
        except Exception as e:
            return response.Response(str(e), status=500)
    
    #DELETE QUEST
    if request.method == 'DELETE':
        targetQuest.delete()
        return response.Response({'id': id, 'message' : 'deleted'},status=200)
    
    #PUT QUEST
    elif request.method == 'PUT':
        serializer = QuestSerializer(targetQuest, data=request.data)
        #quest 객체를 인자값으로 주지 않으면 수정이 아니라 새 데이터 생성이 된다.
        if serializer.is_valid():
            serializer.save()
            return  response.Response(serializer.data, status=201)
    #PATCH QUEST
    elif request.method == 'PATCH': #HTTP Method에는 Update 아니고 PATCH다
        serializer = QuestSerializer(targetQuest, data=request.data, partial=True)
            #quest = 수정할 대상, data = 새 내용, partial 빈칸 허용 
            #partial 옵션으로 일부 데이터만 들어와도 되게 한다.
        if serializer.is_valid():
            serializer.save() #
            return  response.Response(serializer.data, status=201)
    return response.Response(status=500)
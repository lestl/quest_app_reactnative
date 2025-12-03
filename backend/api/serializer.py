from rest_framework import serializers
from .models import quest

class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = quest
        # filed = ('id', 'title', 'description', 'level', 'is_completed') 
        fields = '__all__' #3.3.0 버전 이후부터는 __all__ 로 작성해야함
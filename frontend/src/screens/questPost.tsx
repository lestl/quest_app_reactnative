import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { create_Quest } from '../api/quest_response';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// 1. 함수 이름도 파일 이름과 똑같이 맞추는 게 국룰입니다.
type Props = NativeStackScreenProps<RootStackParamList,'CreateQuest'>

export default function QuestCreateScreen( {navigation}: Props) {
const [newtitle, setTitle] = useState('');
const [newdescription, setDescription] = useState('');
const [newlevel, setLevel] = useState('');

const handleCreateQuest = async () => {
    if (!newtitle || !newdescription || !newlevel) {
        Alert.alert('모든 필드를 작성해주세요.'); 
        return;
}
    try {
        await create_Quest({
            title: newtitle,
            description: newdescription,
            level: Number(newlevel)
        });
        Alert.alert("퀘스트가 등록되었습니다.");
        navigation.goBack();
    }catch(e){
        console.error(e);
        Alert.alert("등록 중 오류발생")
    }
    
};
    
//value와 onChangeText를 사용해 입력값과 동기화시키기 위함
  return (
    <ScrollView 
        contentContainerStyle={styles.container} 
        keyboardShouldPersistTaps="handled"
    >
        {/* 헤더 (선택 사항) */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>퀘스트 생성</Text>
        </View>

        {/* 1. 타이틀 입력 */}
        <View style={styles.formGroup}>
            <Text style={styles.label}>타이틀</Text>
            <TextInput 
                style={styles.input} 
                placeholder='목표 타이틀을 입력하세요' 
                placeholderTextColor="#9ca3af"
                value={newtitle} 
                onChangeText={setTitle}
            />
        </View>

        {/* 2. 설명 입력 (여러 줄 입력 가능하게 스타일링) */}
        <View style={styles.formGroup}>
            <Text style={styles.label}>설명</Text>
            <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder='구체적인 내용을 적어주세요' 
                placeholderTextColor="#9ca3af"
                value={newdescription} 
                onChangeText={setDescription}
                multiline={true} // 여러 줄 입력 허용
                textAlignVertical="top" // 안드로이드 상단 정렬
            />
        </View>

        {/* 3. 레벨 설정 */}
        <View style={styles.formGroup}>
            <Text style={styles.label}>레벨 설정 (1~5)</Text>
            <TextInput 
                style={styles.input} 
                placeholder='숫자 입력' 
                placeholderTextColor="#9ca3af"
                value={newlevel} 
                onChangeText={setLevel} 
                keyboardType='numeric'
                maxLength={1} // 1글자만 입력되게
            />
        </View>

        {/* 4. 커스텀 생성 버튼 */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
                style={styles.createButton} 
                onPress={handleCreateQuest}
                activeOpacity={0.8} // 눌렀을 때 깜빡임 효과
            >
                <Text style={styles.buttonText}>퀘스트 생성하기</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
  );
}
// ✨ 스타일시트 (복사해서 맨 아래에 붙여넣으세요)
const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // 스크롤뷰 안에서도 꽉 차게
        padding: 24,
        backgroundColor: '#fff', // 깨끗한 흰색 배경
    },
    header: {
        marginBottom: 30,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    formGroup: {
        marginBottom: 20, // 각 입력창 사이 간격
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8, // 라벨과 입력창 사이 간격
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#e5e7eb', // 연한 회색 테두리
        borderRadius: 12, // 둥근 모서리
        paddingHorizontal: 16,
        backgroundColor: '#f9fafb', // 아주 연한 회색 배경
        fontSize: 16,
        color: '#1f2937',
    },
    textArea: {
        height: 120, // 설명창은 높게
        paddingTop: 16, // 텍스트 위쪽 여백
    },
    buttonContainer: {
        marginTop: 30, // 버튼 위쪽 여백
    },
    // 커스텀 버튼 스타일
    createButton: {
        backgroundColor: '#4f46e5', // 메인 테마 색상 (보라)
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        // 그림자 효과
        shadowColor: "#4f46e5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    }
});
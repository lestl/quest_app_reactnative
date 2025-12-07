import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity, 
  FlatList, Pressable, Modal } from 'react-native';
import { delete_Quest, put_Quest, patch_Quest, detail_Quest } from '../api/quest_response';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Quest } from '../types/index';

// 1. 함수 이름도 파일 이름과 똑같이 맞추는 게 국룰입니다.
type Props = NativeStackScreenProps<RootStackParamList,'FetchQuest'>
  

const IS_COMPLETED_OPTIONS = [
    {id: 1, label: '진행 중'},
    {id: 2, label: '완료'}
];

export default function FetchQuest( {route, navigation}: Props){
  //route를 받아와서 이용 가능하도록 한다.
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState<number>();
    const [newtitle, setTitle] = useState('');
    const [newdescription, setDescription] = useState('');
    const [newlevel, setLevel] = useState('');
    const [newis_completed, setnewis_completed] = useState<String>();

// 1. 선택된 값을 담을 State
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // 2. 모달(목록)을 보여줄지 말지 결정하는 State
  const [modalVisible, setModalVisible] = useState(false);
//route.params로 navigator로 param을 전달받을 수 있다.
const userid = route.params;

const handleSelect = (item: { label: string }) => {
    setSelectedStatus(item.label); // 선택한 값 입력창에 넣기
    setModalVisible(false);        // 모달 끄기
  };


//페이지 들어올 경우 실행되는 useEffect
//들어왔을 경우 detail_Quest 함수를 실행해서 axios로 데이터 받아옴
useEffect(() =>{
        const detailData = async () => {
            setLoading(true);
            try{
                const data = await detail_Quest(Number(userid.id));
                setTitle(data.title);
                setDescription(data.description);
                setLevel(String(data.level));
                setnewis_completed(data.is_completed ? "완료" : "미완료");
            }catch(e){
                console.error(e);
            }finally{
                setLoading(false);
            }
        }
        detailData();
    },[id]);

//삭제 로직
const handleDeleteQuest = async () => {
  const targetId = Number(userid.id)
    if (!targetId){
        Alert.alert('잘못된 ID입니다.');
        return;
    }
    try {
      var is_agree;
        Alert.alert( //Alert에 이런식으로 값을 줄 수 있음
          "진짜 삭제 하시나요?",
          "삭제하시려면 확인을 눌러주세요",
          [
            {
              text: '네',
              onPress: async () => {await delete_Quest(targetId); Alert.alert("삭제되었습니다.");
                navigation.goBack();}
            },
            {
              text: '아니요',
              onPress: () => Alert.alert("취소했습니다.")
            }
          ]
        );
    }catch(e){
        console.error(e);
        Alert.alert("삭제 중 오류발생");
    }
};

//수정 버튼 클릭 시 이벤트
const handlePutPatchQuest = async () => {
  const targetId = Number(userid.id)
    if (!targetId){
        Alert.alert("유요한 퀘스트 ID가 아닙니다.");
        return;
    }
    //PUT Method Logic
    if(newtitle && newdescription && newlevel){
        try{
            await put_Quest(
                targetId
                ,
                {
                title : newtitle,
                description: newdescription,
                level: Number(newlevel),
                is_completed : Boolean(newis_completed)
            });
            Alert.alert("수정되었습니다.");
            navigation.goBack();
        }catch(e){
            Alert.alert("오류가 발생했습니다.");
        }}
    //PATCH Method Logic
    else {
        if(newtitle || newdescription || newlevel){
        const patchData: Partial<Quest> = {};
        //if문을 이렇게 쓸 수 있다
        //또한 Partial 객체를 만들어서 제네릭에 대한 객체에 부분적으로 값을 할당할 수 있다. (동적할당 시 사용)
        if (newtitle) patchData.title = newtitle;
        if (newdescription) patchData.description = newdescription;
        if (newlevel) patchData.level = Number(newlevel);
            try{
            await patch_Quest(targetId, patchData);
            Alert.alert("수정되었습니다.");
            navigation.goBack();
            }catch(e){
                Alert.alert("오류 발생");
            }
        }
    else{
        Alert.alert("변경할 내용이 없습니다.");
        }
    }
};
    return (
        <View style={styles.container}>
            {/* 타이틀 */}
            <Text style={styles.label}>타이틀 입력</Text>
            <TextInput 
                style={styles.input} 
                placeholder='수정할 타이틀을 입력해주세요.' 
                placeholderTextColor="#999"
                value={newtitle} 
                onChangeText={setTitle}
            />

            {/* 설명 */}
            <Text style={styles.label}>설명 입력</Text>
            <TextInput 
                style={[styles.input, styles.textArea]} // 멀티라인 스타일 추가
                placeholder='퀘스트 설명을 입력해주세요.' 
                placeholderTextColor="#999"
                value={newdescription} 
                onChangeText={setDescription}
                multiline={true} 
            />

            {/* 레벨 */}
            <Text style={styles.label}>레벨 설정</Text>
            <TextInput 
                style={styles.input} 
                placeholder='레벨을 설정해주세요 (숫자)' 
                placeholderTextColor="#999"
                value={newlevel} 
                onChangeText={setLevel} 
                keyboardType='numeric'
            />

            {/* 완료 여부 (모달 선택) */}
            <Text style={styles.label}>완료 여부</Text>
            <Pressable onPress={() => setModalVisible(true)}>
                <View style={styles.selectBoxContainer}>
                    {/* 선택된 텍스트가 보이도록 pointerEvents="none" 처리하거나 editable={false} 유지 */}
                    <TextInput 
                        style={styles.input} 
                        placeholder='상태를 선택해주세요.' 
                        placeholderTextColor="#999"
                        value={selectedStatus} 
                        editable={false} // 키보드 방지
                        pointerEvents="none" // 터치 이벤트를 부모(Pressable)로 넘김
                    />
                    <Text style={styles.arrowIcon}>▼</Text>
                </View>
            </Pressable>

            {/* 모달 컴포넌트 */}
            <Modal 
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>상태를 선택하세요</Text>
                        
                        <FlatList
                            data={IS_COMPLETED_OPTIONS} // 데이터 이름 확인 필요
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.optionItem} 
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        
                        <View style={{marginTop: 10}}>
                             <Button title="취소" onPress={() => setModalVisible(false)} color="#ff5252" />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* 하단 버튼 영역 */}
            <View style={styles.buttonGroup}>
                <View style={styles.buttonWrapper}>
                    <Button title='수정 저장' onPress={handlePutPatchQuest} color="#4f46e5" />
                </View>
                <View style={styles.buttonWrapper}>
                    <Button title='삭제' onPress={handleDeleteQuest} color="#ef4444" />
                </View>
            </View>
        </View>
    );
}

// ✨ 여기가 핵심 스타일시트입니다 ✨
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#ffffff', // 깔끔한 흰색 배경
    },
    label: {
        fontSize: 16,
        fontWeight: '700', // 굵게
        color: '#374151', // 진한 회색
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#e5e7eb', // 연한 테두리
        borderRadius: 12, // 둥근 모서리
        paddingHorizontal: 16,
        backgroundColor: '#f9fafb', // 아주 연한 회색 배경 (입력창 느낌)
        fontSize: 16,
        color: '#111827',
    },
    textArea: {
        height: 100, // 설명창은 높게
        textAlignVertical: 'top', // 안드로이드 텍스트 상단 정렬
        paddingTop: 12,
    },
    // 셀렉트 박스 관련
    selectBoxContainer: {
        position: 'relative', // 화살표 아이콘 위치 기준점
    },
    arrowIcon: {
        position: 'absolute',
        right: 16,
        top: 15, // 높이 중앙 정렬
        fontSize: 14,
        color: '#6b7280',
    },
    // 모달 스타일
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 검은 배경
        justifyContent: 'center', // 중앙 정렬
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        // 그림자 효과
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#111827',
    },
    optionItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    optionText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#374151',
    },
    // 버튼 그룹
    buttonGroup: {
        marginTop: 40,
        flexDirection: 'column', // 세로로 배치 (원하면 row로 변경 가능)
        gap: 12, // 버튼 사이 간격
    },
    buttonWrapper: {
        marginBottom: 10, // gap이 안 먹는 하위 버전 호환용
        borderRadius: 8, // 버튼 자체의 둥근 모서리 효과를 위해
        overflow: 'hidden',
    }
});
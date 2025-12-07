import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Quest } from '../types/index';
import { fetch_QuestsJson } from '../api/quest_response';    
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useFocusEffect } from '@react-navigation/native';


type Props = NativeStackScreenProps<RootStackParamList,'Home'>;
//Navigation Props로 아까 만든 타입인 RootStackParamList를 지정하여 해당 Props이 존재하는걸 알려준다.
//이후 현재 이 페이지는 'Home'이라는 Props을 사용한다는 것을 명시 즉 이 페이지는 'Home'이다.

export default function Main({ navigation }: Props) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. useEffect 대신 useFocusEffect 사용
  // useCallback으로 감싸야 무한루프를 방지.
  useFocusEffect(
    useCallback(() => {
      let isActive = true; // 화면이 아직 유효한지 체크

      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await fetch_QuestsJson();
          if (isActive) { // 아직 화면에 있다면 데이터 업데이트
            setQuests(data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchData();

      // 3. 클린업 (화면 벗어날 때 실행)
      return () => {
        isActive = false;
      };
    }, []) // 의존성 배열은 비워둡니다
  );


    if (loading) {
        return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 1. 리스트 영역 */}
            <FlatList
                data={quests}
                contentContainerStyle={styles.listContent} // 리스트 내부 여백
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('FetchQuest', {id : item.id})}
                    >
{/* //클릭하면 FlatList로 quests의 데이터를 모두 반복문으로 가져온다.
 //그에 따른 데이터의 id로 navigate 가능하도록 한다. 즉 id를 통해 detail 화면으로 갈 수 있다. */}
                        <View style={styles.cardHeader}>
                            <View style={styles.levelBadge}>
                                <Text style={styles.levelText}>Lv.{item.level}</Text>
                            </View>
                            {/* 완료 여부에 따라 색상/글자 다르게 */}
                            <View style={[
                                styles.statusBadge, 
                                item.is_completed ? styles.statusDone : styles.statusIng
                            ]}>
                                <Text style={[
                                    styles.statusText, 
                                    item.is_completed ? styles.textDone : styles.textIng
                                ]}>
                                    {item.is_completed ? "Completed" : "In Progress"}
                                </Text>
                            </View>
                        </View>
                        
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* 2. 퀘스트 생성 버튼 (화면 하단에 떠있는 FAB 스타일) */}
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => navigation.navigate('CreateQuest')}
            >
                <Text style={styles.fabText}>+ 퀘스트 추가</Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa', // 연한 회색 배경
    },
    listContent: {
        padding: 20,
        paddingBottom: 100, // 버튼에 가려지지 않게 여백
    },
    // 카드 스타일
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        // 그림자 효과 (iOS + Android)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    // 레벨 뱃지
    levelBadge: {
        backgroundColor: '#e0e7ff', // 연한 보라
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    levelText: {
        color: '#4f46e5', // 진한 보라
        fontWeight: 'bold',
        fontSize: 12,
    },
    // 상태 뱃지
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusIng: { backgroundColor: '#fff7ed', borderColor: '#fdba74' }, // 주황 배경
    statusDone: { backgroundColor: '#f0fdf4', borderColor: '#86efac' }, // 초록 배경
    
    statusText: { fontSize: 12, fontWeight: '600' },
    textIng: { color: '#c2410c' }, // 주황 글씨
    textDone: { color: '#15803d' }, // 초록 글씨

    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    // 플로팅 버튼 (FAB)
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        left: 20,
        backgroundColor: '#4f46e5',
        borderRadius: 50,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#4f46e5",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    fabText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
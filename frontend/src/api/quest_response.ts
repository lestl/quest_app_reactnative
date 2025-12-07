import axios from 'axios';
import { Quest } from '../types/index';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export async function fetch_QuestsJson(){ 
    const response = await axios.get<Quest[]>(`${BASE_URL}/quests/`);
    return response.data;
}

export async function create_Quest(quest: Omit<Quest, 'id' | 'is_completed'>){
    const response = await axios.post<Quest>(`${BASE_URL}/quests/`, quest);
    return response.data;//Post라 그냥 return만 해도 됨
}

export async function detail_Quest(id: number){
    const response = await axios.get<Quest>(`${BASE_URL}/quests/${id}/`)
    return response.data;
}

export async function delete_Quest(id: number){
    const response = await axios.delete(`${BASE_URL}/quests/${id}/`);
    return response.data;
}

export async function put_Quest(id:number, quest: Omit<Quest, 'id'>){
    //id를 안건들이는게 좋음
    const response = await axios.put<Quest>(`${BASE_URL}/quests/${id}/`, quest);
    return response.data;
}

export async function patch_Quest(id:number, quest: Partial<Quest>){
    //Partial로 해당 제네릭 객체의 모든 필드를 선택 사항으로 만들어줘 부분수정 가능하다.
    const response = await axios.patch<Quest>(`${BASE_URL}/quests/${id}/`, quest);
    return response.data;
}
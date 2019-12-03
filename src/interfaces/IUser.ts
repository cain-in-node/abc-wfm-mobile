import { ILinks } from './ILinks';
import { EGender } from '../enums/EGender';

// Профиль юзера 
export interface IUserProfile {
    outerId: number, // Внешний ID
    firstName: string, // Имя
    patronymicName: string, // Отчество
    lastName: string, // Фамилия
    birthday: Date, // Дата рождения
    startWorkDate: Date, // Начало работы в компании
    endWorkDate: Date | null, // Окончание работы в фирме
    gender: EGender, // Пол
    inn: number | null, // ИНН
    snils: number | null, // Снилс
    email: string | null, // Электронная почта
    needMentor: boolean, // Нуждается ли в наставничестве
    virtual: boolean, // Настоящий или тестовый сотрудник
    id: number, // ID
    _links: ILinks, // Ссылки
    _embedded : {
        avatar: {  
            exists: boolean,
            _links: ILinks
        }
    }     
}

// Общие данные о пользователе 
export interface ITotalUserInfo {
    self: {href: string}, // Получение профиля 
    employee: {href: string}, // Получение рабочего графика 
    roles: {href: string}, // Получение должности
    _links: ILinks, // Ссылки
    id: number // ID
}
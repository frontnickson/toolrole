import type { CardItem } from "../types/navigation";

import icon1 from '../assets/images/landing-icons/smart.png'
import icon2 from '../assets/images/landing-icons/team.png'
import icon3 from '../assets/images/landing-icons/check.png'
import icon4 from '../assets/images/landing-icons/smart state.png'

export const cardItem: CardItem[] = [
    {
        id: 1,
        title: "Умные задачи",
        description: "Умный ИИ лид, ставит вам действительно важные задачи",
        image: icon1,
    },
    {
        id: 2,
        title: "Командная работа",
        description: "Вас будут сопровождать на все пути",
        image: icon2,
    },
    {
        id: 3,
        title: "Профессиональная проверка",
        description: "Ваш умный ментор будет проверять вас и говорить вам инструкции",
        image: icon3,
    },
    {
        id: 4,
        title: "Умная статистика",
        description: "Вы соберете умную статистику для будущего работодателя",
        image: icon4,
    },
];



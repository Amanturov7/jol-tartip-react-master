from datetime import datetime, timedelta
import random
from elasticsearch import Elasticsearch

# Подключение к Elasticsearch
es = Elasticsearch(['http://localhost:9200'])  

# Функция для индексации документа в Elasticsearch
def index_document(index_name, document):
    res = es.index(index=index_name, body=document)
    print(res)

# Список возможных статусов
statuses = ["Новое", "В работе", "Завершено"]

# Список возможных типов нарушений
violation_types = ["Превышение скорости", "Проезд на красный свет", "Парковка в неположенном месте", "Несоблюдение разметки"]

# Список регионов и районов
regions = [
    {"region_id": 1, "region_name": "Баткенская область", "districts": [
        {"district_id": 1, "district_name": "Кадамжайский"},
        {"district_id": 2, "district_name": "Баткенский"},
        {"district_id": 3, "district_name": "Лейлекский"}
    ]},
    {"region_id": 2, "region_name": "Чуйская область", "districts": [
        {"district_id": 4, "district_name": "Кеминский"},
        {"district_id": 5, "district_name": "Чуйский"},
        {"district_id": 6, "district_name": "Иссык-Атинский"},
        {"district_id": 7, "district_name": "Аламединский"},
        {"district_id": 8, "district_name": "Московский"},
        {"district_id": 9, "district_name": "Жайылский"},
        {"district_id": 10, "district_name": "Панфиловский"}
    ]},
    {"region_id": 3, "region_name": "Иссык-кульская область", "districts": [
        {"district_id": 11, "district_name": "Ак-Суу"},
        {"district_id": 12, "district_name": "Жети-Өгүз"},
        {"district_id": 13, "district_name": "Тоң"},
        {"district_id": 14, "district_name": "Түп"},
        {"district_id": 15, "district_name": "Ысык-Көл"}
    ]},
    {"region_id": 4, "region_name": "Таласская область", "districts": [
        {"district_id": 16, "district_name": "Таласский"},
        {"district_id": 17, "district_name": "Манасский"},
        {"district_id": 18, "district_name": "Кара-Бууринский"},
        {"district_id": 19, "district_name": "Бакай-Атинский"}
    ]},
    {"region_id": 5, "region_name": "Ошская область", "districts": [
        {"district_id": 20, "district_name": "Узгенский"},
        {"district_id": 21, "district_name": "Кара-Кульджинский"},
        {"district_id": 22, "district_name": "Кара-Суйский"},
        {"district_id": 23, "district_name": "Алайский"},
        {"district_id": 24, "district_name": "Ноокатский"},
        {"district_id": 25, "district_name": "Чон-Алайский"},
        {"district_id": 26, "district_name": "Араванский"}
    ]},
    {"region_id": 6, "region_name": "Нарынская область", "districts": [
        {"district_id": 27, "district_name": "Джумгальский"},
        {"district_id": 28, "district_name": "Кочкорский"},
        {"district_id": 29, "district_name": "Нарынский"},
        {"district_id": 30, "district_name": "Ак-Талинский"},
        {"district_id": 31, "district_name": "Ат-Башынский"}
    ]},
    {"region_id": 7, "region_name": "Джалал-абадская область", "districts": [
        {"district_id": 32, "district_name": "Кадамжайский"},
        {"district_id": 33, "district_name": "Баткенский"},
        {"district_id": 34, "district_name": "Лейлекский"}
    ]}
]

statuses = ["Принят на рассмотрение", "На рассмотрении", "Протокол составлен"]

# Список регионов и районов (предположим, что он уже определен)

# Список возможных типов нарушений
violation_types = [
    "Не пропустил пешехода",
    "Движение ТС по обочине",
    "Пересечение стоп-линии",
    "Неправильная парковка или остановка",
    "Выезд на встречную полосу",
    "Проезд на красный сигнал светофора"
]

start_date = datetime(2023, 1, 1)
end_date = datetime.now()

for single_date in (start_date + timedelta(n) for n in range((end_date - start_date).days)):
    num_violations = random.randint(10, 20)  # Случайное количество нарушений на каждый день
    for i in range(num_violations):
        region = random.choice(regions)
        district = random.choice(region["districts"])

        violation = {
            "title": random.choice(violation_types),
            "place": f"Место нарушения {(single_date - start_date).days * 100 + i + 1}",
            "status": random.randint(1, 3),       # Выбор случайного статуса
            "statusName": random.choice(statuses),
            "regionId": region["region_id"],
            "regionName": region["region_name"],
            "districtId": district["district_id"],
            "districtName": district["district_name"],
            "date": single_date,           # Используем текущую дату для создания нарушения
        }
        index_document("applications", violation)  # Индексирование документа
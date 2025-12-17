#!/usr/bin/env python3
"""
나무위키 스타일 콘텐츠 형태소 분석 및 JSON 생성 스크립트
50개의 다양한 카테고리 문서를 생성합니다.
"""

import json
import os
from konlpy.tag import Okt

# 형태소 분석기 초기화
okt = Okt()

# 50개의 다양한 카테고리 문서 (인물, 음식, 문화, 역사, 과학, 스포츠 등)
ARTICLES = [
    # 인물 (10개)
    {
        "id": "sejong",
        "title": "세종대왕",
        "category": "인물",
        "text": "세종대왕은 조선의 제4대 왕이다. 한글을 창제하여 백성들이 쉽게 글을 읽고 쓸 수 있도록 하였다. 집현전을 설치하고 많은 학자들을 양성하였다. 측우기와 해시계 등 과학 기구를 발명하였다."
    },
    {
        "id": "yisunshin",
        "title": "이순신",
        "category": "인물",
        "text": "이순신은 조선 시대의 명장이다. 임진왜란 때 거북선을 이끌고 일본 수군을 물리쳤다. 한산도 대첩과 명량 해전에서 대승을 거두었다. 노량 해전에서 전사하였다."
    },
    {
        "id": "bts",
        "title": "BTS",
        "category": "인물",
        "text": "BTS는 대한민국의 보이그룹이다. 방탄소년단이라는 이름으로도 알려져 있다. 빌보드 차트에서 1위를 차지하며 전 세계적으로 인기를 얻었다. 멤버는 RM, 진, 슈가, 제이홉, 지민, 뷔, 정국으로 구성되어 있다."
    },
    {
        "id": "yuna",
        "title": "김연아",
        "category": "인물",
        "text": "김연아는 대한민국의 전 피겨 스케이팅 선수이다. 2010년 밴쿠버 동계 올림픽에서 금메달을 획득하였다. 피겨 스케이팅 역사상 가장 높은 점수를 기록하였다. 피겨 여왕이라는 별명으로 불린다."
    },
    {
        "id": "son",
        "title": "손흥민",
        "category": "인물",
        "text": "손흥민은 대한민국의 축구 선수이다. 영국 프리미어리그 토트넘 홋스퍼에서 뛰고 있다. 아시아 선수 최초로 프리미어리그 득점왕을 차지하였다. 빠른 발과 정확한 슈팅으로 유명하다."
    },
    {
        "id": "jungkook",
        "title": "정국",
        "category": "인물",
        "text": "정국은 BTS의 막내 멤버이다. 본명은 전정국이며 부산 출신이다. 뛰어난 보컬과 댄스 실력을 가지고 있다. 솔로 앨범으로도 큰 성공을 거두었다."
    },
    {
        "id": "newjeans",
        "title": "뉴진스",
        "category": "인물",
        "text": "뉴진스는 대한민국의 걸그룹이다. 민지, 하니, 다니엘, 해린, 혜인으로 구성되어 있다. 데뷔곡 아텐션과 하이프보이가 큰 인기를 얻었다. Y2K 감성의 음악과 패션으로 주목받고 있다."
    },
    {
        "id": "park",
        "title": "박찬욱",
        "category": "인물",
        "text": "박찬욱은 대한민국의 영화감독이다. 올드보이로 칸 영화제에서 심사위원 대상을 수상하였다. 복수 3부작으로 유명하다. 헤어질 결심으로 칸 영화제 감독상을 수상하였다."
    },
    {
        "id": "bong",
        "title": "봉준호",
        "category": "인물",
        "text": "봉준호는 대한민국의 영화감독이다. 기생충으로 아카데미 작품상을 수상하였다. 살인의 추억, 괴물, 설국열차 등 다양한 장르의 영화를 만들었다. 사회 비판적인 메시지를 담은 작품으로 유명하다."
    },
    {
        "id": "yoojae",
        "title": "유재석",
        "category": "인물",
        "text": "유재석은 대한민국의 방송인이다. 무한도전과 런닝맨으로 국민 MC로 불린다. 뛰어난 진행 능력과 유머 감각을 가지고 있다. 대한민국 예능의 역사를 쓴 인물이다."
    },
    # 음식 (10개)
    {
        "id": "kimchi",
        "title": "김치",
        "category": "음식",
        "text": "김치는 대한민국의 대표적인 발효 음식이다. 배추, 무, 고춧가루, 마늘, 젓갈 등을 사용하여 만든다. 유네스코 인류무형문화유산에 등재되어 있다. 비타민과 유산균이 풍부하여 건강에 좋다."
    },
    {
        "id": "bibimbap",
        "title": "비빔밥",
        "category": "음식",
        "text": "비빔밥은 밥 위에 나물과 고추장을 넣고 비벼 먹는 음식이다. 전주 비빔밥이 가장 유명하다. 다양한 채소와 고기가 어우러져 영양가가 높다. 돌솥비빔밥은 바닥에 누룽지가 생긴다."
    },
    {
        "id": "bulgogi",
        "title": "불고기",
        "category": "음식",
        "text": "불고기는 얇게 썬 소고기를 양념에 재워 구운 음식이다. 간장, 설탕, 배, 마늘 등으로 양념을 만든다. 달콤하고 짭짤한 맛이 특징이다. 외국인들에게도 인기가 많은 한식이다."
    },
    {
        "id": "tteokbokki",
        "title": "떡볶이",
        "category": "음식",
        "text": "떡볶이는 가래떡을 고추장 소스에 볶은 음식이다. 길거리 음식으로 시작하여 국민 간식이 되었다. 어묵, 삶은 달걀, 야채 등을 함께 넣기도 한다. 치즈를 넣은 치즈 떡볶이도 인기가 있다."
    },
    {
        "id": "samgyeopsal",
        "title": "삼겹살",
        "category": "음식",
        "text": "삼겹살은 돼지의 삼겹 부위를 구워 먹는 음식이다. 쌈장과 상추에 싸서 먹는 것이 일반적이다. 소주와 함께 먹는 것이 한국인의 문화이다. 3월 3일은 삼겹살 데이로 지정되어 있다."
    },
    {
        "id": "chimaek",
        "title": "치맥",
        "category": "음식",
        "text": "치맥은 치킨과 맥주를 함께 먹는 것을 말한다. 한국의 대표적인 음식 문화이다. 후라이드, 양념, 간장 등 다양한 치킨이 있다. 축구 경기나 야구 경기를 보며 먹는 것이 유행이다."
    },
    {
        "id": "ramyeon",
        "title": "라면",
        "category": "음식",
        "text": "라면은 한국에서 가장 사랑받는 인스턴트 식품이다. 신라면, 진라면, 너구리 등 다양한 종류가 있다. 계란과 파를 넣어 끓이면 더 맛있다. 한국인은 연간 약 80개의 라면을 소비한다."
    },
    {
        "id": "sundae",
        "title": "순대",
        "category": "음식",
        "text": "순대는 돼지 창자에 당면과 선지를 넣어 만든 음식이다. 백순대, 피순대, 야채 순대 등 종류가 다양하다. 떡볶이와 함께 먹는 순대볶음도 인기가 있다. 병천 순대가 유명하다."
    },
    {
        "id": "jjigae",
        "title": "김치찌개",
        "category": "음식",
        "text": "김치찌개는 김치를 주재료로 끓인 찌개이다. 돼지고기나 참치를 넣어 끓이기도 한다. 밥과 함께 먹는 대표적인 한식이다. 묵은 김치로 끓이면 더 깊은 맛이 난다."
    },
    {
        "id": "naengmyeon",
        "title": "냉면",
        "category": "음식",
        "text": "냉면은 차가운 국물에 면을 말아 먹는 음식이다. 평양냉면과 함흥냉면이 대표적이다. 여름철에 특히 인기가 있는 음식이다. 식초와 겨자를 넣어 새콤하게 먹는다."
    },
    # 문화/장소 (10개)
    {
        "id": "hanbok",
        "title": "한복",
        "category": "문화",
        "text": "한복은 한국의 전통 의상이다. 설날과 추석에 주로 입는다. 저고리, 치마, 바지 등으로 구성되어 있다. 현대에는 개량 한복도 인기를 얻고 있다."
    },
    {
        "id": "seollal",
        "title": "설날",
        "category": "문화",
        "text": "설날은 음력 1월 1일로 한국의 명절이다. 가족들이 모여 떡국을 먹는다. 어른들께 세배를 드리고 세뱃돈을 받는다. 윷놀이와 널뛰기 같은 전통 놀이를 한다."
    },
    {
        "id": "chuseok",
        "title": "추석",
        "category": "문화",
        "text": "추석은 음력 8월 15일로 한가위라고도 부른다. 차례를 지내고 성묘를 간다. 송편을 빚어 먹는 것이 전통이다. 보름달을 보며 소원을 빈다."
    },
    {
        "id": "hangul",
        "title": "한글",
        "category": "문화",
        "text": "한글은 세종대왕이 창제한 한국의 문자이다. 훈민정음이라는 이름으로 1443년에 만들어졌다. 24개의 자음과 모음으로 구성되어 있다. 과학적이고 배우기 쉬운 문자로 평가받는다."
    },
    {
        "id": "taekwondo",
        "title": "태권도",
        "category": "문화",
        "text": "태권도는 한국의 전통 무술이다. 올림픽 정식 종목으로 채택되어 있다. 발차기 기술이 특징적이다. 전 세계 200개국 이상에서 수련되고 있다."
    },
    {
        "id": "kpop",
        "title": "K-POP",
        "category": "문화",
        "text": "K-POP은 한국의 대중음악을 말한다. BTS, 블랙핑크 등이 세계적인 인기를 얻고 있다. 칼군무와 퍼포먼스가 특징이다. 한류의 핵심 콘텐츠로 자리 잡았다."
    },
    {
        "id": "gyeongbokgung",
        "title": "경복궁",
        "category": "문화",
        "text": "경복궁은 조선 시대의 법궁이다. 서울 광화문 뒤에 위치해 있다. 근정전이 가장 중심 건물이다. 한복을 입으면 무료로 입장할 수 있다."
    },
    {
        "id": "jeju",
        "title": "제주도",
        "category": "문화",
        "text": "제주도는 대한민국 최대의 섬이다. 한라산과 성산일출봉이 유명하다. 유네스코 세계자연유산에 등재되어 있다. 돌하르방과 해녀가 상징이다."
    },
    {
        "id": "busan",
        "title": "부산",
        "category": "문화",
        "text": "부산은 대한민국 제2의 도시이다. 해운대와 광안리 해수욕장이 유명하다. 자갈치 시장에서 신선한 해산물을 맛볼 수 있다. 부산 국제 영화제가 매년 열린다."
    },
    {
        "id": "namsan",
        "title": "남산타워",
        "category": "문화",
        "text": "남산타워는 서울의 대표적인 랜드마크이다. 서울 시내를 한눈에 볼 수 있다. 사랑의 자물쇠가 유명하다. 케이블카를 타고 올라갈 수 있다."
    },
    # 역사 (10개)
    {
        "id": "joseon",
        "title": "조선",
        "category": "역사",
        "text": "조선은 1392년부터 1897년까지 존속한 왕조이다. 이성계가 건국하였다. 유교를 국가 이념으로 삼았다. 한글, 측우기 등 많은 문화유산을 남겼다."
    },
    {
        "id": "goguryeo",
        "title": "고구려",
        "category": "역사",
        "text": "고구려는 삼국 시대의 나라 중 하나이다. 광개토대왕 때 영토를 크게 넓혔다. 고분 벽화가 유명하다. 수나라와 당나라의 침략을 막아냈다."
    },
    {
        "id": "baekje",
        "title": "백제",
        "category": "역사",
        "text": "백제는 삼국 시대의 나라 중 하나이다. 웅진과 사비에 도읍을 두었다. 일본에 문화를 전파하였다. 무령왕릉이 유명한 유적이다."
    },
    {
        "id": "silla",
        "title": "신라",
        "category": "역사",
        "text": "신라는 삼국 시대의 나라 중 하나이다. 삼국을 통일한 나라이다. 경주가 수도였다. 불국사와 석굴암이 대표적인 유적이다."
    },
    {
        "id": "goryeo",
        "title": "고려",
        "category": "역사",
        "text": "고려는 918년부터 1392년까지 존속한 왕조이다. 고려청자가 유명하다. 팔만대장경을 만들었다. 몽골의 침략에 맞서 싸웠다."
    },
    {
        "id": "imjin",
        "title": "임진왜란",
        "category": "역사",
        "text": "임진왜란은 1592년 일본이 조선을 침략한 전쟁이다. 이순신 장군이 바다에서 일본군을 막았다. 의병들이 곳곳에서 일어났다. 7년간 지속된 전쟁이다."
    },
    {
        "id": "gwangbok",
        "title": "광복절",
        "category": "역사",
        "text": "광복절은 8월 15일로 일본으로부터 해방된 날이다. 1945년에 광복을 맞이하였다. 대한민국의 국경일 중 하나이다. 태극기를 게양하여 기념한다."
    },
    {
        "id": "korean_war",
        "title": "한국전쟁",
        "category": "역사",
        "text": "한국전쟁은 1950년 6월 25일에 시작되었다. 북한의 남침으로 시작된 전쟁이다. 3년간 지속되었다. 1953년 휴전 협정이 체결되었다."
    },
    {
        "id": "democracy",
        "title": "민주화 운동",
        "category": "역사",
        "text": "민주화 운동은 군사 독재에 맞선 시민들의 운동이다. 4.19 혁명과 5.18 민주화 운동이 대표적이다. 1987년 6월 항쟁으로 직선제를 이루어냈다. 민주주의 발전에 기여하였다."
    },
    {
        "id": "olympics",
        "title": "서울 올림픽",
        "category": "역사",
        "text": "서울 올림픽은 1988년에 개최되었다. 대한민국 최초의 올림픽이다. 잠실 올림픽 주경기장에서 열렸다. 손에 손잡고가 주제가였다."
    },
    # 과학/기술 (5개)
    {
        "id": "samsung",
        "title": "삼성전자",
        "category": "과학",
        "text": "삼성전자는 대한민국의 대표적인 전자 회사이다. 스마트폰과 반도체를 생산한다. 갤럭시 시리즈가 대표 제품이다. 세계 최대의 메모리 반도체 회사이다."
    },
    {
        "id": "hyundai",
        "title": "현대자동차",
        "category": "과학",
        "text": "현대자동차는 대한민국의 자동차 회사이다. 쏘나타, 그랜저 등이 대표 모델이다. 전기차와 수소차 개발에 힘쓰고 있다. 기아와 함께 현대차그룹을 이루고 있다."
    },
    {
        "id": "naver",
        "title": "네이버",
        "category": "과학",
        "text": "네이버는 대한민국의 대표적인 포털 사이트이다. 검색, 뉴스, 쇼핑 등 다양한 서비스를 제공한다. 라인이라는 메신저를 운영하고 있다. 웹툰과 V라이브도 인기 서비스이다."
    },
    {
        "id": "kakao",
        "title": "카카오",
        "category": "과학",
        "text": "카카오는 대한민국의 IT 기업이다. 카카오톡이라는 메신저로 유명하다. 카카오뱅크, 카카오택시 등 다양한 서비스를 운영한다. 판교에 본사가 있다."
    },
    {
        "id": "nuri",
        "title": "누리호",
        "category": "과학",
        "text": "누리호는 대한민국이 독자 개발한 우주발사체이다. 2022년 발사에 성공하였다. 나로우주센터에서 발사되었다. 한국이 세계 7번째 우주 강국이 되었다."
    },
    # 스포츠 (5개)
    {
        "id": "worldcup",
        "title": "2002 월드컵",
        "category": "스포츠",
        "text": "2002 월드컵은 한일 공동 개최로 열렸다. 대한민국이 4강에 진출하였다. 붉은 악마의 응원이 유명했다. 오~ 필승 코리아가 응원가였다."
    },
    {
        "id": "baseball",
        "title": "한국 야구",
        "category": "스포츠",
        "text": "한국 야구는 KBO 리그를 중심으로 운영된다. 삼성, 롯데, LG 등 10개 구단이 있다. 프로야구는 1982년에 시작되었다. 잠실과 고척 돔에서 경기가 열린다."
    },
    {
        "id": "esports",
        "title": "e스포츠",
        "category": "스포츠",
        "text": "e스포츠는 전자 게임을 통한 스포츠 경기이다. 한국은 e스포츠 강국이다. 리그 오브 레전드와 스타크래프트가 대표적이다. 페이커가 유명한 프로게이머이다."
    },
    {
        "id": "ssireum",
        "title": "씨름",
        "category": "스포츠",
        "text": "씨름은 한국의 전통 스포츠이다. 샅바를 잡고 상대를 넘어뜨리면 이긴다. 천하장사 대회가 유명하다. 유네스코 인류무형문화유산에 등재되어 있다."
    },
    {
        "id": "archery",
        "title": "양궁",
        "category": "스포츠",
        "text": "양궁은 한국이 강한 스포츠이다. 올림픽에서 꾸준히 금메달을 획득하고 있다. 김수녕, 박성현 등이 유명한 선수이다. 정확한 집중력과 멘탈이 중요하다."
    },
]

def analyze_text(text):
    """텍스트를 형태소 분석하여 토큰 리스트로 변환"""
    tokens = []
    
    # Okt로 형태소 분석 (품사 태깅)
    pos_result = okt.pos(text, stem=False)
    
    for word, pos in pos_result:
        # 품사에 따라 마스킹 여부 결정
        # 명사(Noun), 고유명사는 마스킹
        if pos in ['Noun', 'ProperNoun']:
            token_type = 'noun'
            is_masked = True
        elif pos in ['Josa']:  # 조사
            token_type = 'particle'
            is_masked = False
        elif pos in ['Verb', 'Adjective']:  # 동사, 형용사
            token_type = 'verb'
            is_masked = False
        elif pos in ['Punctuation']:  # 구두점
            token_type = 'punctuation'
            is_masked = False
        else:  # 기타 (부사, 관형사 등)
            token_type = 'other'
            is_masked = False
        
        tokens.append({
            'text': word,
            'type': token_type,
            'pos': pos,
            'isMasked': is_masked
        })
    
    return tokens

def generate_article_json(article):
    """문서를 분석하여 JSON 형식으로 변환"""
    tokens = analyze_text(article['text'])
    
    return {
        'id': article['id'],
        'title': article['title'],
        'category': article['category'],
        'tokens': tokens,
        'totalMasked': sum(1 for t in tokens if t['isMasked']),
        'totalTokens': len(tokens)
    }

def main():
    """메인 함수: 모든 문서를 분석하고 JSON 파일로 저장"""
    output_dir = 'src/data/articles'
    os.makedirs(output_dir, exist_ok=True)
    
    article_index = []
    
    print(f"총 {len(ARTICLES)}개 문서 분석 시작...")
    
    for i, article in enumerate(ARTICLES):
        result = generate_article_json(article)
        
        # 개별 JSON 파일 저장
        filepath = os.path.join(output_dir, f"{article['id']}.json")
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        # 인덱스에 추가
        article_index.append({
            'id': article['id'],
            'title': article['title'],
            'category': article['category'],
            'totalMasked': result['totalMasked']
        })
        
        print(f"  [{i+1}/{len(ARTICLES)}] {article['title']} - {result['totalMasked']}개 단어 마스킹")
    
    # 인덱스 파일 저장
    index_path = os.path.join(output_dir, 'index.json')
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump({
            'totalArticles': len(article_index),
            'categories': list(set(a['category'] for a in article_index)),
            'articles': article_index
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 완료! {len(ARTICLES)}개 문서가 {output_dir}에 저장되었습니다.")

if __name__ == '__main__':
    main()

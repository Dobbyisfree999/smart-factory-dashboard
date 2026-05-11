import React, { useState } from "react";

const productionTarget = 3140;
const currentProduction = 1884;
const achievementRate = Math.round((currentProduction / productionTarget) * 100);

const boxSummary = { L: 16, M: 50, S: 50 };

const orders = [
  { id: "ORD-005", ramen: "신라면 8, 진라면 4, 너구리 6, 불닭 12, 짜파게티 10", qty: 40, box: "L", boxId: "BX-005-L-01", status: "박스 배정 완료" },
  { id: "ORD-011", ramen: "신라면 6, 진라면 8, 너구리 8, 불닭 12, 짜파게티 6", qty: 40, box: "L", boxId: "BX-011-L-01", status: "박스 배정 완료" },
  { id: "ORD-017", ramen: "신라면 2, 진라면 10, 너구리 4, 불닭 10, 짜파게티 14", qty: 40, box: "L", boxId: "BX-017-L-01", status: "박스 배정 완료" },
  { id: "ORD-002", ramen: "신라면 4, 진라면 6, 너구리 8, 불닭 6, 짜파게티 6", qty: 30, box: "M", boxId: "BX-002-M-01", status: "박스화 대기" },
  { id: "ORD-001", ramen: "신라면 2, 진라면 4, 너구리 2, 불닭 6, 짜파게티 6", qty: 20, box: "S", boxId: "BX-001-S-01", status: "생산 대기" },
];

const workOrders = [
  { job: "JOB-001", order: "ORD-005", priority: 1, target: "Supply-01", type: "라면 배출", item: "신라면", qty: "8 EA", status: "진행 중" },
  { job: "JOB-002", order: "ORD-005", priority: 1, target: "Supply-02", type: "라면 배출", item: "진라면", qty: "4 EA", status: "대기" },
  { job: "JOB-003", order: "ORD-005", priority: 1, target: "Supply-03", type: "라면 배출", item: "너구리", qty: "6 EA", status: "대기" },
  { job: "JOB-004", order: "ORD-005", priority: 1, target: "Supply-04", type: "라면 배출", item: "불닭", qty: "12 EA", status: "진행 중" },
  { job: "JOB-005", order: "ORD-005", priority: 1, target: "Supply-05", type: "라면 배출", item: "짜파게티", qty: "10 EA", status: "대기" },
  { job: "JOB-006", order: "ORD-005", priority: 1, target: "Box Former", type: "박스 성형", item: "L Box", qty: "1 EA", status: "완료" },
  { job: "JOB-007", order: "ORD-005", priority: 1, target: "ACR-01", type: "Bin 이송", item: "신라면 Bin", qty: "1 Bin", status: "진행 중" },
  { job: "JOB-008", order: "ORD-011", priority: 2, target: "Box Former", type: "박스 성형", item: "L Box", qty: "1 EA", status: "대기" },
];

const inventoryItems = [
  { item: "신라면", qty: 14560, bins: 182, safety: 12000, rack: "Rack-1 / Rack-2", acr: "ACR-01", supply: "Supply-01", status: "정상" },
  { item: "진라면", qty: 14560, bins: 182, safety: 12000, rack: "Rack-2 / Rack-3", acr: "ACR-05", supply: "Supply-05", status: "정상" },
  { item: "너구리", qty: 14560, bins: 182, safety: 12000, rack: "Rack-3 / Rack-4", acr: "ACR-02", supply: "Supply-03", status: "정상" },
  { item: "불닭볶음면", qty: 14000, bins: 175, safety: 12000, rack: "Rack-4 / Rack-5", acr: "ACR-03", supply: "Supply-04", status: "정상" },
  { item: "짜파게티", qty: 14000, bins: 175, safety: 12000, rack: "Rack-5 / Rack-6", acr: "ACR-04", supply: "Supply-02", status: "정상" },
];

const binLocations = [
  { bin: "Bin-1", item: "신라면", rack: "Rack-1", level: "1층", qty: 80, destination: "Supply-01", status: "보관 중" },
  { bin: "Bin-2", item: "진라면", rack: "Rack-1", level: "1층", qty: 80, destination: "Supply-05", status: "보관 중" },
  { bin: "Bin-3", item: "너구리", rack: "Rack-1", level: "1층", qty: 80, destination: "Supply-03", status: "이송 대기" },
  { bin: "Bin-4", item: "불닭볶음면", rack: "Rack-1", level: "1층", qty: 80, destination: "Supply-04", status: "이송 중" },
  { bin: "Bin-5", item: "짜파게티", rack: "Rack-1", level: "1층", qty: 80, destination: "Supply-02", status: "공급부 도착" },
];

const acrStatus = [
  { acr: "ACR-01", item: "신라면", from: "Rack-1", to: "Supply-01", status: "대기", battery: "92%" },
  { acr: "ACR-02", item: "너구리", from: "Rack-3", to: "Supply-03", status: "이송 중", battery: "86%" },
  { acr: "ACR-03", item: "불닭볶음면", from: "Rack-4", to: "Supply-04", status: "이송 중", battery: "78%" },
  { acr: "ACR-04", item: "짜파게티", from: "Rack-5", to: "Supply-02", status: "복귀 중", battery: "81%" },
  { acr: "ACR-05", item: "진라면", from: "Rack-2", to: "Supply-05", status: "대기", battery: "95%" },
];

const equipmentStatus = [
  { equipment: "Supply-01", type: "공급부", plc: "Connected", sensor: "정상", status: "정상", uptime: "98.4%", nextCheck: "2026-05-10" },
  { equipment: "Supply-02", type: "공급부", plc: "Connected", sensor: "정상", status: "정상", uptime: "97.9%", nextCheck: "2026-05-10" },
  { equipment: "Supply-03", type: "공급부", plc: "Connected", sensor: "신호 지연", status: "주의", uptime: "94.2%", nextCheck: "2026-05-08" },
  { equipment: "Supply-04", type: "공급부", plc: "Connected", sensor: "정상", status: "정상", uptime: "96.8%", nextCheck: "2026-05-11" },
  { equipment: "Supply-05", type: "공급부", plc: "Connected", sensor: "정상", status: "정상", uptime: "98.1%", nextCheck: "2026-05-11" },
  { equipment: "Box Former", type: "박스 성형기", plc: "Connected", sensor: "정상", status: "정상", uptime: "99.0%", nextCheck: "2026-05-12" },
  { equipment: "Main Conveyor", type: "컨베이어", plc: "Connected", sensor: "정상", status: "정상", uptime: "98.7%", nextCheck: "2026-05-13" },
  { equipment: "ACR Fleet", type: "물류 로봇", plc: "Wireless", sensor: "정상", status: "정상", uptime: "95.6%", nextCheck: "2026-05-09" },
];

const maintenanceAlarms = [
  { code: "ALM-001", equipment: "Supply-03", level: "주의", message: "배출 센서 응답 지연 감지", action: "센서 감도 및 케이블 체결 확인" },
  { code: "ALM-002", equipment: "ACR-03", level: "점검", message: "배터리 잔량 78% / 연속 운행 중", action: "교대 전 충전 스테이션 복귀 확인" },
  { code: "ALM-003", equipment: "Box Former", level: "예방", message: "박스 성형 누적 5,000 Cycle 도달 예정", action: "성형 실린더 윤활 및 마모 확인" },
];

const preventiveSchedule = [
  { date: "2026-05-08", equipment: "Supply-03", task: "센서 신호 지연 점검", owner: "Maintenance A", status: "금일 점검" },
  { date: "2026-05-09", equipment: "ACR Fleet", task: "주행 경로 및 충전 상태 점검", owner: "Logistics Tech", status: "예정" },
  { date: "2026-05-10", equipment: "Supply-01 / Supply-02", task: "스토퍼 회전부 및 컨베이어 구동 확인", owner: "Maintenance B", status: "예정" },
  { date: "2026-05-12", equipment: "Box Former", task: "S/M/L 박스 성형부 정렬 확인", owner: "Maintenance A", status: "예정" },
];


const inventoryTrendData = [
  { date: "05/01", shin: 9200, jin: 8600, neoguri: 7800, buldak: 7400, japagetti: 8100 },
  { date: "05/02", shin: 9800, jin: 8200, neoguri: 7650, buldak: 6900, japagetti: 8350 },
  { date: "05/03", shin: 10500, jin: 7700, neoguri: 7400, buldak: 6300, japagetti: 8650 },
  { date: "05/04", shin: 11200, jin: 7200, neoguri: 7000, buldak: 5700, japagetti: 9000 },
  { date: "05/05", shin: 11800, jin: 6800, neoguri: 6750, buldak: 5100, japagetti: 9350 },
  { date: "05/06", shin: 12400, jin: 6400, neoguri: 6500, buldak: 4500, japagetti: 9700 },
];

const trendSeries = [
  { key: "shin", label: "신라면", color: "#1c69d4" },
  { key: "jin", label: "진라면", color: "#dc2626" },
  { key: "neoguri", label: "너구리", color: "#f59e0b" },
  { key: "buldak", label: "불닭볶음면", color: "#7c3aed" },
  { key: "japagetti", label: "짜파게티", color: "#16a34a" },
];

const supplyUtilization = [
  { name: "Supply-01", item: "신라면", rate: 92, note: "안정적인 고가동" },
  { name: "Supply-02", item: "짜파게티", rate: 81, note: "정상 운전" },
  { name: "Supply-03", item: "너구리", rate: 65, note: "여유 있음" },
  { name: "Supply-04", item: "불닭볶음면", rate: 97, note: "과부하 주의" },
  { name: "Supply-05", item: "진라면", rate: 74, note: "감소 품목 대응 필요" },
];

const acrAnalysis = [
  { name: "ACR-01", work: 42, item: "신라면", state: "정상" },
  { name: "ACR-02", work: 38, item: "너구리", state: "정상" },
  { name: "ACR-03", work: 55, item: "불닭볶음면", state: "작업 집중" },
  { name: "ACR-04", work: 35, item: "짜파게티", state: "정상" },
  { name: "ACR-05", work: 31, item: "진라면", state: "보충 대기" },
];

export default function App() {
  const [menu, setMenu] = useState("Production");

  return (
    <>
      <GlobalStyles />
      <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logo}>CL</div>
          <div>
            <h2 style={styles.brandTitle}>CodeLab Company</h2>
            <p style={styles.brandSub}>Industrial MES Software Solution</p>
          </div>
        </div>

        <nav style={styles.nav}>
          {["Production", "Work Orders", "Inventory", "Maintenance", "Analytics"].map((item) => (
            <button key={item} onClick={() => setMenu(item)} style={menu === item ? styles.navActive : styles.navItem}>{item}</button>
          ))}
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div>
            <p style={styles.eyebrow}>SMART FACTORY MES PLATFORM</p>
            <h1 style={styles.title}>{menu === "Production" ? "Production Management Dashboard" : menu}</h1>
          </div>

          <div style={styles.topActions}>
            <input style={styles.search} placeholder="Search order, job, equipment..." />
            <button style={styles.secondaryBtn}>Notifications</button>
            <button style={styles.primaryBtn}>Operator</button>
          </div>
        </header>

        {menu === "Production" && <ProductionPage />}
        {menu === "Work Orders" && <WorkOrdersPage />}
        {menu === "Inventory" && <InventoryPage />}
        {menu === "Maintenance" && <MaintenancePage />}
        {menu === "Analytics" && <AnalyticsPage />}
        {menu !== "Production" && menu !== "Work Orders" && menu !== "Inventory" && menu !== "Maintenance" && menu !== "Analytics" && <EmptyPage title={menu} />}
      </main>
      </div>
    </>
  );
}

function ProductionPage() {
  return (
    <>
      <Hero label="CODELAB SMART FACTORY MES" title="생산 관리자 UI" text="CSV 주문 데이터를 기반으로 금일 생산 대상 주문, 박스 우선순위, 생산 목표 달성률, 박스화 상태를 통합 관리합니다." statusTitle="PRODUCTION TARGET" statusValue={`${productionTarget.toLocaleString()} EA`} statusText="CSV 총 주문 수량 기준" />
      <section style={styles.kpiGrid}>
        <Kpi title="금일 생산 대상 주문" value="116건" desc="CSV 주문 데이터 기준" />
        <Kpi title="생산 목표 달성률" value={`${achievementRate}%`} desc={`${currentProduction.toLocaleString()} / ${productionTarget.toLocaleString()} EA`} />
        <Kpi title="L 박스 우선 처리" value={`${boxSummary.L}건`} desc="우선순위 1순위" />
        <Kpi title="박스화 대기" value={`${boxSummary.M + boxSummary.S}건`} desc="M/S 박스 순차 처리" />
      </section>
      <section style={styles.contentGrid}>
        <div style={styles.panel}>
          <SectionHead label="ORDER PRIORITY" title="금일 생산 대상 주문" right="우선순위 기준: L → M → S → 주문순" />
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>우선</th><th style={styles.th}>주문번호</th><th style={styles.thWide}>주문 품목</th><th style={styles.th}>수량</th><th style={styles.th}>박스</th><th style={styles.th}>상태</th></tr></thead>
            <tbody>{orders.map((order, index) => <tr key={order.id}><td style={styles.td}>{index + 1}</td><td style={styles.tdStrong}>{order.id}</td><td style={styles.td}>{order.ramen}</td><td style={styles.td}>{order.qty} EA</td><td style={styles.td}><BoxBadge box={order.box} /></td><td style={styles.td}><Status text={order.status} /></td></tr>)}</tbody>
          </table>
        </div>
        <div style={styles.panel}>
          <p style={styles.sectionLabel}>ACHIEVEMENT</p><h3 style={styles.sectionTitle}>생산 목표 대비 달성률</h3>
          <div style={styles.gaugeBox}><div style={{ ...styles.gauge, background: `conic-gradient(#1c69d4 0deg ${achievementRate * 3.6}deg, #ebebeb ${achievementRate * 3.6}deg 360deg)` }}><div style={styles.gaugeInner}><strong>{achievementRate}%</strong><span>Achievement</span></div></div></div>
          <Metric label="금일 생산 목표" value={`${productionTarget.toLocaleString()} EA`} />
          <Metric label="현재 생산 수량" value={`${currentProduction.toLocaleString()} EA`} />
          <Metric label="잔여 생산 수량" value={`${(productionTarget - currentProduction).toLocaleString()} EA`} />
          <button style={styles.fullBtn}>+ 불량 기록 등록</button>
        </div>
      </section>
      <section style={styles.bottomGrid}>
        <div style={styles.panel}><p style={styles.sectionLabel}>BOXING STATUS</p><h3 style={styles.sectionTitle}>박스화 상태 목업</h3><div style={styles.boxGrid}><BoxSummary box="L" count={16} desc="대형 박스 / 최우선 처리" /><BoxSummary box="M" count={50} desc="중형 박스 / 2순위 처리" /><BoxSummary box="S" count={50} desc="소형 박스 / 3순위 처리" /></div></div>
        <div style={styles.panel}><p style={styles.sectionLabel}>SUPPLY SCHEDULE</p><h3 style={styles.sectionTitle}>동적 공급부 배정</h3><div style={styles.queueList}><QueueItem title="Supply-01" desc="신라면 / ORD-005 / 8 EA" status="진행 중" /><QueueItem title="Supply-02" desc="진라면 / ORD-005 / 4 EA" status="대기" /><QueueItem title="Supply-03" desc="너구리 / ORD-005 / 6 EA" status="대기" /><QueueItem title="Supply-04" desc="불닭 / ORD-005 / 12 EA" status="진행 중" /><QueueItem title="Supply-05" desc="짜파게티 / ORD-005 / 10 EA" status="대기" /></div></div>
      </section>
    </>
  );
}

function WorkOrdersPage() {
  return (
    <>
      <Hero label="DISTRIBUTED COMMAND MONITORING" title="작업 지시 현황" text="MES에서 이미 분배된 명령을 설비별로 확인하는 화면입니다. 공급부, ACR, Box Former에 내려간 작업 지시와 실행 상태를 모니터링합니다." statusTitle="COMMAND STATUS" statusValue="DISTRIBUTED" statusText="MES 명령 분배 완료" />
      <section style={styles.kpiGrid}><Kpi title="전체 작업 지시" value="32건" desc="금일 분배 명령 기준" /><Kpi title="공급부 작업" value="20건" desc="Supply-01 ~ Supply-05" /><Kpi title="ACR 이송 작업" value="7건" desc="Rack → Supply 이송" /><Kpi title="Box Former 작업" value="5건" desc="S/M/L 박스 성형" /></section>
      <section style={styles.panel}><SectionHead label="WORK ORDER TABLE" title="설비별 작업 지시 목록" right="상태 흐름: 분배 완료 → 대기 → 진행 중 → 완료" /><table style={styles.table}><thead><tr><th style={styles.th}>작업 ID</th><th style={styles.th}>원본 주문</th><th style={styles.th}>우선순위</th><th style={styles.th}>대상 설비</th><th style={styles.th}>작업 유형</th><th style={styles.th}>품목/박스</th><th style={styles.th}>수량</th><th style={styles.th}>상태</th></tr></thead><tbody>{workOrders.map((job) => <tr key={job.job}><td style={styles.tdStrong}>{job.job}</td><td style={styles.td}>{job.order}</td><td style={styles.td}>{job.priority}</td><td style={styles.tdStrong}>{job.target}</td><td style={styles.td}>{job.type}</td><td style={styles.td}>{job.item}</td><td style={styles.td}>{job.qty}</td><td style={styles.td}><Status text={job.status} /></td></tr>)}</tbody></table></section>
      <section style={styles.bottomGrid}><div style={styles.panel}><p style={styles.sectionLabel}>EQUIPMENT QUEUE</p><h3 style={styles.sectionTitle}>설비별 분배 현황</h3><div style={styles.queueList}><QueueItem title="Supply Queue" desc="라면 배출 명령 20건 분배 완료" status="Active" /><QueueItem title="ACR Queue" desc="Bin 이송 명령 7건 분배 완료" status="Active" /><QueueItem title="Box Former Queue" desc="박스 성형 명령 5건 분배 완료" status="Ready" /></div></div><div style={styles.panel}><p style={styles.sectionLabel}>COMMAND FLOW</p><h3 style={styles.sectionTitle}>MES 명령 분배 흐름</h3><div style={styles.flow}><FlowStep number="01" title="주문 우선순위 정렬" desc="L → M → S → 주문순" /><FlowStep number="02" title="작업 지시 생성" desc="라면 배출 / 박스 성형 / Bin 이송" /><FlowStep number="03" title="설비별 명령 분배" desc="Supply / ACR / Box Former" /><FlowStep number="04" title="작업 상태 모니터링" desc="대기 / 진행 중 / 완료" /></div></div></section>
    </>
  );
}

function InventoryPage() {
  const totalQty = inventoryItems.reduce((sum, item) => sum + item.qty, 0);
  const totalBins = inventoryItems.reduce((sum, item) => sum + item.bins, 0);
  return (
    <>
      <Hero label="INVENTORY & LOGISTICS CONTROL" title="재고/물류 담당 UI" text="Inventory_Status.csv의 Rack, Level, Bin, Ramen_Type, Quantity 데이터를 기반으로 전체 재고, Bin 위치, ACR 보충 운행 상태를 관리합니다." statusTitle="TOTAL INVENTORY" statusValue={`${totalQty.toLocaleString()} EA`} statusText="CSV Quantity 합산 기준" />
      <section style={styles.kpiGrid}>
        <Kpi title="전체 재고 수량" value={`${totalQty.toLocaleString()} EA`} desc="Inventory_Status.csv 기준" />
        <Kpi title="전체 Bin 수량" value={`${totalBins}개`} desc="CSV Bin 행 기준" />
        <Kpi title="랙 구성" value="6개 Rack" desc="Rack-1 ~ Rack-6" />
        <Kpi title="ACR 운행 상태" value="5대" desc="이송 중 2 / 대기 2 / 복귀 1" />
      </section>
      <section style={styles.contentGrid}>
        <div style={styles.panel}>
          <SectionHead label="RAMEN INVENTORY" title="라면별 재고 현황" right="안전 재고 기준: 12,000 EA" />
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>품목</th><th style={styles.th}>현재 재고</th><th style={styles.th}>Bin</th><th style={styles.th}>보관 Rack</th><th style={styles.th}>담당 ACR</th><th style={styles.th}>공급부</th><th style={styles.th}>상태</th></tr></thead>
            <tbody>{inventoryItems.map((item) => <tr key={item.item}><td style={styles.tdStrong}>{item.item}</td><td style={styles.td}>{item.qty.toLocaleString()} EA</td><td style={styles.td}>{item.bins}개</td><td style={styles.td}>{item.rack}</td><td style={styles.td}>{item.acr}</td><td style={styles.td}>{item.supply}</td><td style={styles.td}><Status text={item.status} /></td></tr>)}</tbody>
          </table>
        </div>
        <div style={styles.panel}>
          <p style={styles.sectionLabel}>BOX / BIN SUMMARY</p><h3 style={styles.sectionTitle}>상자 및 Bin 요약</h3>
          <div style={styles.boxGridSingle}><BoxSummary box="S" count={42} desc="소형 출고 상자 / 목업" /><BoxSummary box="M" count={36} desc="중형 출고 상자 / 목업" /><BoxSummary box="L" count={28} desc="대형 출고 상자 / 목업" /></div>
          <div style={styles.noticeBox}><strong>재고 기준</strong><p>CSV의 Quantity는 Bin 1개당 80 EA로 구성되어 있으며, 총 896개 Bin 데이터가 들어가 있습니다.</p></div>
        </div>
      </section>
      <section style={styles.bottomGrid}>
        <div style={styles.panel}>
          <SectionHead label="BIN LOCATION" title="Bin 위치 현황" right="Rack / Level / Destination" />
          <table style={styles.table}><thead><tr><th style={styles.th}>Bin</th><th style={styles.th}>품목</th><th style={styles.th}>현재 위치</th><th style={styles.th}>수량</th><th style={styles.th}>목적지</th><th style={styles.th}>상태</th></tr></thead><tbody>{binLocations.map((bin) => <tr key={bin.bin}><td style={styles.tdStrong}>{bin.bin}</td><td style={styles.td}>{bin.item}</td><td style={styles.td}>{bin.rack} / {bin.level}</td><td style={styles.td}>{bin.qty} EA</td><td style={styles.td}>{bin.destination}</td><td style={styles.td}><Status text={bin.status} /></td></tr>)}</tbody></table>
        </div>
        <div style={styles.panel}>
          <SectionHead label="ACR LOGISTICS" title="ACR 보충 운행 상태" right="총 5대 운행" />
          <div style={styles.queueList}>{acrStatus.map((acr) => <QueueItem key={acr.acr} title={`${acr.acr} · ${acr.item}`} desc={`${acr.from} → ${acr.to} / Battery ${acr.battery}`} status={acr.status} />)}</div>
        </div>
      </section>
    </>
  );
}


function MaintenancePage() {
  return (
    <>
      <Hero
        label="EQUIPMENT MAINTENANCE CONTROL"
        title="설비/유지보수 담당 UI"
        text="공급부, Box Former, Main Conveyor, ACR Fleet의 설비 상태와 PLC 통신, 센서 이상, 예방 정비 일정을 통합 모니터링합니다."
        statusTitle="FACILITY STATUS"
        statusValue="ATTENTION"
        statusText="Supply-03 센서 신호 지연 확인 필요"
      />

      <section style={styles.kpiGrid}>
        <Kpi title="전체 설비" value="8대" desc="Supply 5 / Box Former / Conveyor / ACR" />
        <Kpi title="정상 설비" value="7대" desc="주요 설비 정상 운전" />
        <Kpi title="점검 알림" value="3건" desc="주의 1 / 점검 1 / 예방 1" />
        <Kpi title="PLC 통신" value="정상" desc="주요 제어 신호 연결됨" />
      </section>

      <section style={styles.contentGrid}>
        <div style={styles.panel}>
          <SectionHead label="EQUIPMENT STATUS" title="설비 상태 모니터링" right="PLC / Sensor / Uptime" />
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>설비명</th>
                <th style={styles.th}>구분</th>
                <th style={styles.th}>PLC</th>
                <th style={styles.th}>센서</th>
                <th style={styles.th}>가동률</th>
                <th style={styles.th}>다음 점검</th>
                <th style={styles.th}>상태</th>
              </tr>
            </thead>
            <tbody>
              {equipmentStatus.map((eq) => (
                <tr key={eq.equipment}>
                  <td style={styles.tdStrong}>{eq.equipment}</td>
                  <td style={styles.td}>{eq.type}</td>
                  <td style={styles.td}>{eq.plc}</td>
                  <td style={styles.td}>{eq.sensor}</td>
                  <td style={styles.td}>{eq.uptime}</td>
                  <td style={styles.td}>{eq.nextCheck}</td>
                  <td style={styles.td}><Status text={eq.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.panel}>
          <p style={styles.sectionLabel}>REAL-TIME ALARM</p>
          <h3 style={styles.sectionTitle}>실시간 알람</h3>
          <div style={styles.queueList}>
            {maintenanceAlarms.map((alarm) => (
              <QueueItem
                key={alarm.code}
                title={`${alarm.code} · ${alarm.equipment}`}
                desc={`${alarm.message} / ${alarm.action}`}
                status={alarm.level}
              />
            ))}
          </div>
        </div>
      </section>

      <section style={styles.bottomGrid}>
        <div style={styles.panel}>
          <SectionHead label="PREVENTIVE MAINTENANCE" title="예방 정비 일정" right="설비 정지 전 사전 점검" />
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>일자</th>
                <th style={styles.th}>설비</th>
                <th style={styles.thWide}>점검 내용</th>
                <th style={styles.th}>담당자</th>
                <th style={styles.th}>상태</th>
              </tr>
            </thead>
            <tbody>
              {preventiveSchedule.map((item) => (
                <tr key={`${item.date}-${item.equipment}`}>
                  <td style={styles.tdStrong}>{item.date}</td>
                  <td style={styles.td}>{item.equipment}</td>
                  <td style={styles.td}>{item.task}</td>
                  <td style={styles.td}>{item.owner}</td>
                  <td style={styles.td}><Status text={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.panel}>
          <p style={styles.sectionLabel}>MAINTENANCE FLOW</p>
          <h3 style={styles.sectionTitle}>유지보수 처리 흐름</h3>
          <div style={styles.flow}>
            <FlowStep number="01" title="설비 이상 감지" desc="PLC 신호, 센서 응답, 가동률 데이터 확인" />
            <FlowStep number="02" title="알람 등록" desc="주의 / 점검 / 예방 정비 상태로 분류" />
            <FlowStep number="03" title="담당자 배정" desc="유지보수 담당자 또는 물류 담당자에게 점검 할당" />
            <FlowStep number="04" title="조치 이력 저장" desc="Firebase에 점검 결과와 조치 내용을 기록" />
          </div>
        </div>
      </section>
    </>
  );
}


function AnalyticsPage() {
  return (
    <>
      <Hero
        label="DATA ANALYTICS & OPERATION INSIGHT"
        title="분석 대시보드"
        text="임의 기간별 재고 변화 데이터를 꺾은선 그래프로 시각화하고, 감소 추세 품목에 대해 추가 물량 확보와 설비 운영 전략을 제안합니다."
        statusTitle="ANALYSIS RESULT"
        statusValue="ACTION REQUIRED"
        statusText="불닭볶음면 / 진라면 추가 확보 권장"
      />

      <section style={styles.kpiGrid}>
        <Kpi title="증가 추세 품목" value="2종" desc="신라면 / 짜파게티" />
        <Kpi title="감소 추세 품목" value="3종" desc="진라면 / 너구리 / 불닭볶음면" />
        <Kpi title="우선 확보 품목" value="불닭볶음면" desc="가장 큰 감소 추세" />
        <Kpi title="추가 확보 권장" value="4,000 EA" desc="불닭 2,000 / 진라면 1,200 / 너구리 800" />
      </section>

      <section style={styles.contentGridAnalytics}>
        <div style={styles.panel}>
          <SectionHead label="INVENTORY TREND" title="품목별 재고 변화 꺾은선 그래프" right="임의 기간 기준 / EA 단위" />
          <LineChart data={inventoryTrendData} series={trendSeries} />
          <div style={styles.legendRow}>
            {trendSeries.map((item) => (
              <div key={item.key} style={styles.legendItem}>
                <span style={{ ...styles.legendDot, background: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.panel}>
          <p style={styles.sectionLabel}>MES RECOMMENDATION</p>
          <h3 style={styles.sectionTitle}>추천 조치 사항</h3>
          <div style={styles.flow}>
            <FlowStep number="01" title="불닭볶음면 추가 확보" desc="재고 감소 폭이 가장 크므로 2,000 EA 추가 확보 권장" />
            <FlowStep number="02" title="진라면 안전재고 보강" desc="지속적인 하락 추세로 1,200 EA 예비 물량 확보 필요" />
            <FlowStep number="03" title="Supply-04 부하 관리" desc="불닭 배출 작업 집중으로 공급부 과부하 모니터링 필요" />
            <FlowStep number="04" title="ACR-03 작업 분산" desc="불닭 Bin 이송 집중 상태이므로 ACR 작업 분산 검토" />
          </div>
        </div>
      </section>

      <section style={styles.bottomGrid}>
        <div style={styles.panel}>
          <p style={styles.sectionLabel}>TREND SUMMARY</p>
          <h3 style={styles.sectionTitle}>품목별 추세 분석 결과</h3>
          <div style={styles.trendCardGrid}>
            <TrendCard title="신라면" value="증가" desc="9,200 → 12,400 EA / 공급 안정" type="up" />
            <TrendCard title="짜파게티" value="증가" desc="8,100 → 9,700 EA / 재고 여유" type="up" />
            <TrendCard title="진라면" value="감소" desc="8,600 → 6,400 EA / 추가 확보 필요" type="down" />
            <TrendCard title="불닭볶음면" value="급감" desc="7,400 → 4,500 EA / 최우선 보충" type="danger" />
          </div>
        </div>

        <div style={styles.panel}>
          <SectionHead label="EQUIPMENT ANALYSIS" title="공급부 및 ACR 분석" right="운영 부하 기준" />
          <div style={styles.analysisGrid}>
            <div>
              <h4 style={styles.smallTitle}>공급부 사용률</h4>
              {supplyUtilization.map((supply) => (
                <ProgressRow key={supply.name} label={`${supply.name} · ${supply.item}`} value={supply.rate} note={supply.note} />
              ))}
            </div>
            <div>
              <h4 style={styles.smallTitle}>ACR 운행 분석</h4>
              {acrAnalysis.map((acr) => (
                <QueueItem key={acr.name} title={`${acr.name} · ${acr.item}`} desc={`금일 작업 ${acr.work}회`} status={acr.state} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
      * { box-sizing: border-box; }
      html, body, #root {
        margin: 0;
        width: 100%;
        min-height: 100%;
        background: #ffffff;
        font-family: 'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        color: #1f2933;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-size: 18px;
      }
      button, input {
        font-family: 'Pretendard', 'Noto Sans KR', system-ui, sans-serif;
      }
      button { cursor: pointer; }
      table { border-spacing: 0; }
    `}</style>
  );
}

function Hero({ label, title, text }) {
  return (
    <section style={styles.hero}>
      <div>
        <p style={styles.heroLabel}>{label}</p>
        <h2 style={styles.heroTitle}>{title}</h2>
        <p style={styles.heroText}>{text}</p>
      </div>
    </section>
  );
}
function EmptyPage({ title }) { return <Hero label="CODELAB SMART FACTORY MES" title={title} text="이 화면은 다음 단계에서 제작할 예정입니다." />; }
function SectionHead({ label, title, right }) { return <div style={styles.sectionHead}><div><p style={styles.sectionLabel}>{label}</p><h3 style={styles.sectionTitle}>{title}</h3></div><span style={styles.priorityRule}>{right}</span></div>; }
function Kpi({ title, value, desc }) { return <div style={styles.kpiCard}><p>{title}</p><h2>{value}</h2><span>{desc}</span></div>; }
function Metric({ label, value }) { return <div style={styles.metricRow}><span>{label}</span><strong>{value}</strong></div>; }
function BoxBadge({ box }) { const color = box === "L" ? "#1c69d4" : box === "M" ? "#f59e0b" : "#22c55e"; return <span style={{ ...styles.boxBadge, borderColor: color, color }}>{box} BOX</span>; }
function Status({ text }) { return <span style={styles.status}>{text}</span>; }
function BoxSummary({ box, count, desc }) { return <div style={styles.boxSummary}><p>{box} BOX</p><h2>{count}건</h2><span>{desc}</span></div>; }
function QueueItem({ title, desc, status }) { return <div style={styles.queueItem}><div><strong>{title}</strong><p>{desc}</p></div><span>{status}</span></div>; }
function FlowStep({ number, title, desc }) { return <div style={styles.flowStep}><strong>{number}</strong><div><h4>{title}</h4><p>{desc}</p></div></div>; }


function LineChart({ data, series }) {
  const width = 900;
  const height = 360;
  const padding = { top: 28, right: 36, bottom: 42, left: 64 };
  const values = data.flatMap((row) => series.map((item) => row[item.key]));
  const minValue = Math.floor((Math.min(...values) - 400) / 1000) * 1000;
  const maxValue = Math.ceil((Math.max(...values) + 400) / 1000) * 1000;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const getX = (index) => padding.left + (index / (data.length - 1)) * innerWidth;
  const getY = (value) => padding.top + ((maxValue - value) / (maxValue - minValue)) * innerHeight;
  const yTicks = [minValue, minValue + (maxValue - minValue) * 0.25, minValue + (maxValue - minValue) * 0.5, minValue + (maxValue - minValue) * 0.75, maxValue];

  return (
    <div style={styles.chartWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} style={styles.svgChart} preserveAspectRatio="none">
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={padding.left} x2={width - padding.right} y1={getY(tick)} y2={getY(tick)} stroke="#e6e6e6" strokeWidth="1" />
            <text x={padding.left - 12} y={getY(tick) + 4} textAnchor="end" fontSize="14" fill="#6b6b6b">{Math.round(tick).toLocaleString()}</text>
          </g>
        ))}

        <line x1={padding.left} x2={padding.left} y1={padding.top} y2={height - padding.bottom} stroke="#cccccc" strokeWidth="1" />
        <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} stroke="#cccccc" strokeWidth="1" />

        {data.map((row, index) => (
          <text key={row.date} x={getX(index)} y={height - 16} textAnchor="middle" fontSize="14" fill="#3c3c3c">{row.date}</text>
        ))}

        {series.map((item) => {
          const points = data.map((row, index) => `${getX(index)},${getY(row[item.key])}`).join(" ");
          return (
            <g key={item.key}>
              <polyline points={points} fill="none" stroke={item.color} strokeWidth="3" strokeLinejoin="miter" strokeLinecap="square" />
              {data.map((row, index) => (
                <circle key={`${item.key}-${row.date}`} cx={getX(index)} cy={getY(row[item.key])} r="4" fill="#ffffff" stroke={item.color} strokeWidth="2" />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TrendCard({ title, value, desc, type }) {
  const color = type === "up" ? "#16a34a" : type === "danger" ? "#dc2626" : "#f59e0b";
  return (
    <div style={styles.trendCard}>
      <p>{title}</p>
      <h3 style={{ color }}>{value}</h3>
      <span>{desc}</span>
    </div>
  );
}

function ProgressRow({ label, value, note }) {
  return (
    <div style={styles.progressRow}>
      <div style={styles.progressHead}>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${value}%` }} />
      </div>
      <p>{note}</p>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#ffffff",
    color: "#1f2933",
    fontFamily: "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif",
    fontSize: 18,
    lineHeight: 1.65,
  },
  sidebar: {
    width: 310,
    background: "#fafafa",
    borderRight: "1px solid #e6e6e6",
    padding: "34px 30px",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    minHeight: "100vh",
  },
  brand: { display: "flex", gap: 14, alignItems: "center", marginBottom: 44 },
  logo: {
    width: 54,
    height: 54,
    background: "#1c69d4",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 17,
    letterSpacing: 0.3,
  },
  brandTitle: { margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: -0.2, lineHeight: 1.25 },
  brandSub: { margin: "8px 0 0", fontSize: 15, color: "#5f6b76", lineHeight: 1.45, fontWeight: 500 },
  nav: { display: "flex", flexDirection: "column", gap: 12 },
  navItem: {
    height: 56,
    background: "transparent",
    border: "none",
    textAlign: "left",
    padding: "0 16px",
    fontWeight: 700,
    color: "#1f2933",
    cursor: "pointer",
    fontSize: 17,
  },
  navActive: {
    height: 56,
    background: "#1a2129",
    color: "#ffffff",
    border: "none",
    textAlign: "left",
    padding: "0 16px",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 17,
  },
  main: {
    flex: 1,
    padding: "42px 56px 80px",
    overflow: "visible",
    minWidth: 0,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    marginBottom: 28,
  },
  eyebrow: {
    margin: 0,
    color: "#1c69d4",
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: 1.6,
  },
  title: {
    margin: "8px 0 0",
    fontSize: 42,
    fontWeight: 800,
    color: "#1f2933",
    letterSpacing: -0.8,
    lineHeight: 1.18,
  },
  topActions: { display: "flex", gap: 10, alignItems: "center", flexShrink: 0 },
  search: {
    width: 420,
    height: 56,
    border: "1px solid #cfd6dd",
    padding: "0 16px",
    fontSize: 17,
    color: "#1f2933",
    outline: "none",
  },
  primaryBtn: {
    height: 56,
    border: "none",
    background: "#1c69d4",
    color: "#ffffff",
    padding: "0 24px",
    fontWeight: 800,
    fontSize: 17,
  },
  secondaryBtn: {
    height: 56,
    border: "1px solid #cfd6dd",
    background: "#ffffff",
    color: "#1f2933",
    padding: "0 24px",
    fontWeight: 800,
    fontSize: 17,
  },
  hero: {
    background: "#1a2129",
    color: "#ffffff",
    padding: "58px 64px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 28,
    minHeight: 230,
  },
  heroLabel: {
    margin: 0,
    color: "#c6cbd1",
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: 1.6,
  },
  heroTitle: {
    margin: "14px 0 12px",
    fontSize: 56,
    fontWeight: 800,
    letterSpacing: -1.0,
    lineHeight: 1.15,
  },
  heroText: {
    maxWidth: 1080,
    color: "#d3d7dc",
    lineHeight: 1.75,
    fontSize: 20,
    fontWeight: 500,
    margin: 0,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
    gap: 24,
    marginBottom: 32,
  },
  kpiCard: {
    background: "#fafafa",
    border: "1px solid #e1e5e9",
    padding: "32px 34px",
    minHeight: 155,
    fontSize: 18,
    lineHeight: 1.45,
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(500px, 1fr)",
    gap: 34,
    marginBottom: 34,
    alignItems: "start",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 34,
    marginTop: 34,
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #e1e5e9",
    padding: "36px 38px",
  },
  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 22,
  },
  sectionLabel: {
    margin: 0,
    color: "#1c69d4",
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: 1.6,
  },
  sectionTitle: {
    margin: "8px 0 0",
    fontSize: 30,
    fontWeight: 800,
    color: "#1f2933",
    letterSpacing: -0.4,
    lineHeight: 1.25,
  },
  priorityRule: { fontSize: 16, color: "#5f6b76", fontWeight: 700, lineHeight: 1.5 },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    fontSize: 17,
    lineHeight: 1.65,
  },
  th: {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "1px solid #e1e5e9",
    color: "#5f6b76",
    fontSize: 17,
    fontWeight: 800,
    lineHeight: 1.45,
  },
  thWide: {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "1px solid #e1e5e9",
    color: "#5f6b76",
    fontSize: 13,
    fontWeight: 800,
    width: "34%",
    lineHeight: 1.4,
  },
  td: {
    padding: "20px 14px",
    borderBottom: "1px solid #e8ecef",
    color: "#1f2933",
    verticalAlign: "middle",
    lineHeight: 1.55,
    fontWeight: 500,
    wordBreak: "keep-all",
  },
  tdStrong: {
    padding: "20px 14px",
    borderBottom: "1px solid #e8ecef",
    color: "#111827",
    fontWeight: 800,
    lineHeight: 1.55,
  },
  boxBadge: {
    display: "inline-block",
    border: "1px solid",
    padding: "6px 10px",
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  },
  status: {
    display: "inline-block",
    background: "#f7f7f7",
    border: "1px solid #cfd6dd",
    padding: "6px 10px",
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.2,
    color: "#1f2933",
    whiteSpace: "nowrap",
  },
  gaugeBox: { display: "flex", justifyContent: "center", margin: "34px 0" },
  gauge: { width: 210, height: 210, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  gaugeInner: {
    width: 140,
    height: 140,
    borderRadius: "50%",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    padding: "15px 0",
    borderTop: "1px solid #e1e5e9",
    fontSize: 17,
    lineHeight: 1.5,
  },
  fullBtn: {
    width: "100%",
    height: 60,
    marginTop: 18,
    background: "#1c69d4",
    color: "#ffffff",
    border: "none",
    fontWeight: 800,
    fontSize: 17,
  },
  boxGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginTop: 22 },
  boxGridSingle: { display: "grid", gridTemplateColumns: "1fr", gap: 16, marginTop: 22 },
  boxSummary: {
    background: "#fafafa",
    border: "1px solid #e1e5e9",
    padding: "28px 26px",
    fontSize: 18,
    lineHeight: 1.45,
  },
  queueList: { display: "flex", flexDirection: "column", gap: 14, marginTop: 22 },
  queueItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fafafa",
    border: "1px solid #e1e5e9",
    padding: "18px 20px",
    gap: 18,
    fontSize: 17,
    lineHeight: 1.55,
  },
  flow: { display: "flex", flexDirection: "column", gap: 16, marginTop: 22 },
  flowStep: {
    display: "flex",
    gap: 18,
    background: "#fafafa",
    border: "1px solid #e1e5e9",
    padding: "20px",
    fontSize: 17,
    lineHeight: 1.65,
  },
  contentGridAnalytics: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(500px, 1fr)",
    gap: 34,
    marginBottom: 34,
    alignItems: "start",
  },
  chartWrap: {
    width: "100%",
    height: 560,
    marginTop: 22,
    background: "#fafafa",
    border: "1px solid #e1e5e9",
    padding: 18,
  },
  svgChart: { width: "100%", height: "100%", display: "block" },
  legendRow: {
    display: "flex",
    gap: 22,
    flexWrap: "wrap",
    marginTop: 18,
    fontSize: 17,
    color: "#3c4650",
    lineHeight: 1.4,
  },
  legendItem: { display: "flex", alignItems: "center", gap: 9, fontWeight: 700 },
  legendDot: { width: 13, height: 13, display: "inline-block" },
  trendCardGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18, marginTop: 22 },
  trendCard: {
    background: "#fafafa",
    border: "1px solid #e1e5e9",
    padding: "22px 20px",
    fontSize: 17,
    lineHeight: 1.655,
  },
  analysisGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 20 },
  smallTitle: { margin: "0 0 18px", fontSize: 22, fontWeight: 800, color: "#1f2933", lineHeight: 1.3 },
  progressRow: { marginBottom: 22, fontSize: 17, lineHeight: 1.45 },
  progressHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 17,
    fontWeight: 800,
    marginBottom: 9,
  },
  progressTrack: { height: 12, background: "#ebebeb", border: "1px solid #e1e5e9" },
  progressFill: { height: "100%", background: "#1c69d4" },
  noticeBox: {
    marginTop: 22,
    background: "#f7f7f7",
    border: "1px solid #e1e5e9",
    padding: "18px 20px",
    lineHeight: 1.65,
    fontSize: 17,
    color: "#1f2933",
  },
};

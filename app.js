// ==========================================
// FINGER IQ
// 지문 카메라 촬영 시스템
// ==========================================



// ==========================================
// 접속 비밀번호
// ==========================================

// GitHub Pages 같은 정적 사이트에서는 이 비밀번호가 소스코드에 포함됩니다.
// 강한 보안 기능이 아니라 허용 사용자용 간단한 입장 제한 기능입니다.
const ACCESS_PASSWORD = "finger1004";

const passwordGate =
    document.getElementById("passwordGate");

const accessPasswordInput =
    document.getElementById("accessPassword");

const passwordEnterBtn =
    document.getElementById("passwordEnterBtn");

const passwordError =
    document.getElementById("passwordError");

function unlockApp() {

    const entered =
        accessPasswordInput.value;

    if (entered === ACCESS_PASSWORD) {

        sessionStorage.setItem(
            "fingerIQUnlocked",
            "yes"
        );

        passwordGate.style.display =
            "none";

        passwordError.textContent =
            "";

        return;
    }

    passwordError.textContent =
        "비밀번호가 올바르지 않습니다.";

    accessPasswordInput.focus();
}

if (
    sessionStorage.getItem(
        "fingerIQUnlocked"
    ) === "yes"
) {

    passwordGate.style.display =
        "none";
}

passwordEnterBtn.addEventListener(
    "click",
    unlockApp
);

accessPasswordInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            unlockApp();
        }
    }
);


// 10개 손가락 순서
const fullFingers = [

    {
        hand: "왼손",
        name: "엄지",
        key: "left_thumb"
    },

    {
        hand: "왼손",
        name: "검지",
        key: "left_index"
    },

    {
        hand: "왼손",
        name: "중지",
        key: "left_middle"
    },

    {
        hand: "왼손",
        name: "약지",
        key: "left_ring"
    },

    {
        hand: "왼손",
        name: "새끼",
        key: "left_little"
    },

    {
        hand: "오른손",
        name: "엄지",
        key: "right_thumb"
    },

    {
        hand: "오른손",
        name: "검지",
        key: "right_index"
    },

    {
        hand: "오른손",
        name: "중지",
        key: "right_middle"
    },

    {
        hand: "오른손",
        name: "약지",
        key: "right_ring"
    },

    {
        hand: "오른손",
        name: "새끼",
        key: "right_little"
    }

];


const simpleFingerKeys = [
    "left_thumb","left_index","right_thumb","right_index"
];

let fingers = [...fullFingers];
let testMode = "simple";

// 현재 손가락
let currentIndex = 0;


// 검사자
let participant = {

    name: "",
    birth: "",
    consultant: ""

};


// 지문 데이터
let fingerprintImages = {};

// 동일 손가락 2회 판독 비교
let repeatCaptures = {};
function requiredCapturesPerFinger() {
    return testMode === "simple" ? 2 : 1;
}


// ==========================================
// HTML 요소
// ==========================================

const startScreen =
    document.getElementById("startScreen");

const fingerScreen =
    document.getElementById("fingerScreen");

const completeScreen =
    document.getElementById("completeScreen");

const resultScreen =
    document.getElementById("resultScreen");

const resultParticipant =
    document.getElementById("resultParticipant");

const top3Results =
    document.getElementById("top3Results");

const intelligenceResults =
    document.getElementById("intelligenceResults");

const learningStyleResult =
    document.getElementById("learningStyleResult");

const fingerPatternResults =
    document.getElementById("fingerPatternResults");

const restartBtn =
    document.getElementById("restartBtn");

const pdfBtn =
    document.getElementById("pdfBtn");


const nameInput =
    document.getElementById("name");

const birthInput =
    document.getElementById("birth");

const consultantInput =
    document.getElementById("consultant");


const startBtn =
    document.getElementById("startBtn");


const currentNumber =
    document.getElementById("currentNumber");

const totalNumber =
    document.getElementById("totalNumber");

const progress =
    document.getElementById("progress");


const handLabel =
    document.getElementById("handLabel");

const fingerName =
    document.getElementById("fingerName");


const cameraBtn =
    document.getElementById("cameraBtn");

const cameraInput =
    document.getElementById("cameraInput");


const galleryBtn =
    document.getElementById("galleryBtn");

const galleryInput =
    document.getElementById("galleryInput");


const previewArea =
    document.getElementById("previewArea");


const photoActions =
    document.getElementById("photoActions");


const retakeBtn =
    document.getElementById("retakeBtn");


const usePhotoBtn =
    document.getElementById("usePhotoBtn");


const nextBtn =
    document.getElementById("nextBtn");


const analysisBtn =
    document.getElementById("analysisBtn");


totalNumber.textContent =
    fingers.length;


// ==========================================
// 화면 전환
// ==========================================

function showScreen(screen) {

    startScreen.classList.remove("active");

    fingerScreen.classList.remove("active");

    completeScreen.classList.remove("active");

    resultScreen.classList.remove("active");

    screen.classList.add("active");

}


// ==========================================
// 검사 시작
// ==========================================

startBtn.addEventListener(
    "click",
    function () {

        const name =
            nameInput.value.trim();


        if (!name) {

            alert(
                "검사자 이름을 입력해주세요."
            );

            nameInput.focus();

            return;

        }


        participant.name =
            name;

        participant.birth =
            birthInput.value;

        participant.consultant =
            consultantInput.value.trim();


        const selectedMode =
            document.querySelector('input[name="testMode"]:checked');

        testMode = selectedMode ? selectedMode.value : "simple";
        fingers =
            testMode === "simple"
                ? fullFingers.filter(f => simpleFingerKeys.includes(f.key))
                : [...fullFingers];

        currentIndex = 0;
        fingerprintImages = {};
        repeatCaptures = {};

        showScreen(fingerScreen);

        loadFinger();

    }
);


// ==========================================
// 현재 손가락 표시
// ==========================================

function loadFinger() {

    const finger =
        fingers[currentIndex];


    handLabel.textContent =
        finger.hand;


    const repeatCount =
        repeatCaptures[finger.key]
            ? repeatCaptures[finger.key].length
            : 0;

    fingerName.innerHTML =
        `${finger.hand} ${finger.name} 지문
         <div class="repeat-capture-status">
            반복 촬영 ${Math.min(repeatCount + 1, requiredCapturesPerFinger())}
            / ${requiredCapturesPerFinger()}
         </div>`;


    currentNumber.textContent =
        currentIndex + 1;


    const percent =
        ((currentIndex + 1)
        / fingers.length) * 100;


    progress.style.width =
        `${percent}%`;


    previewArea.innerHTML =
        "촬영한 지문이 여기에 표시됩니다.";


    photoActions.style.display =
        "none";


    nextBtn.disabled =
        true;


    cameraInput.value =
        "";

    galleryInput.value =
        "";

}


// ==========================================
// 카메라 실행
// ==========================================

cameraBtn.addEventListener(
    "click",
    function () {

        cameraInput.click();

    }
);


// ==========================================
// 사진 선택
// ==========================================

galleryBtn.addEventListener(
    "click",
    function () {

        galleryInput.click();

    }
);


// ==========================================
// 카메라 사진 처리
// ==========================================

cameraInput.addEventListener(
    "change",
    function (event) {

        handlePhoto(event);

    }
);


// ==========================================
// 갤러리 사진 처리
// ==========================================

galleryInput.addEventListener(
    "change",
    function (event) {

        handlePhoto(event);

    }
);


// ==========================================
// 사진 처리 함수
// ==========================================

function handlePhoto(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    if (!file.type.startsWith("image/")) {

        alert(
            "이미지 파일만 사용할 수 있습니다."
        );

        return;

    }


    const reader =
        new FileReader();

reader.onload =
    function (e) {

        previewArea.innerHTML = "";

        const img =
            document.createElement("img");

        img.src =
            e.target.result;

        previewArea.appendChild(img);


        // 이미지가 실제로 로드된 후 품질 검사
        img.onload = function () {

            const quality =
                ImageQuality.analyze(
                    file,
                    img
                );
         const fingerprint =
    FingerprintDetector.analyze(
        img
    );
            // 품질 결과 표시
            const qualityBox =
                document.createElement("div");

            qualityBox.className =
                "quality-result";


            let icon = "⚠️";

            if (quality.level === "good") {

                icon = "✅";

            } else if (
                quality.level === "bad"
            ) {

                icon = "❌";

            }


            qualityBox.innerHTML = `

                <div class="quality-icon">
                    ${icon}
                </div>

                <div class="quality-title">
                    사진 품질 점수
                    ${quality.score}점
                </div>

                <div class="quality-message">
                    ${quality.message}
                </div>

                <div class="quality-details">

                    선명도 ${quality.sharpness} ·
                    밝기 ${quality.brightness} ·
                    대비 ${quality.contrast}

                </div>

            `;


            previewArea.appendChild(
                qualityBox
            );
const fingerprintBox =
    document.createElement("div");

fingerprintBox.className =
    "fingerprint-result";

fingerprintBox.innerHTML = `

    <div class="fingerprint-title">
        🔍 지문 패턴 자동 추정
    </div>

    <div class="fingerprint-pattern">
        ${fingerprint.label}
    </div>

    <div class="fingerprint-confidence">
        추정 신뢰도 ${fingerprint.confidence}%
    </div>

    <div class="fingerprint-reason">
        ${fingerprint.reason}
    </div>

    ${
        fingerprint.pattern === "UNKNOWN" &&
        fingerprint.tooSmall !== true &&
        fingerprint.focusIssue !== true
            ? `
                <div class="fingerprint-warning">
                    재촬영 없이 진행할 수도 있습니다.
                    이 경우 가장 가까운 유형으로 낮은 신뢰도로 임시 분류합니다.
                </div>
              `
            : ""
    }

    ${
        fingerprint.debug
            ? `
                <div class="fingerprint-debug">
                    융선점수 ${fingerprint.debug.ridgeScore ?? "-"} ·
                    방향일관성 ${fingerprint.debug.coherence ?? "-"} ·
                    중심변화 ${fingerprint.debug.centerVariation ?? "-"} ·
                    곡률 ${fingerprint.debug.curvature ?? "-"} ·
                    유효융선 ${fingerprint.debug.usableRidgeRatio ?? "-"} ·
                    ROI ${fingerprint.debug.roiScale ?? "-"}
                    ${
                        fingerprint.debug.scores
                            ? `<br>후보비율
                               평아치 ${fingerprint.debug.probabilities?.ARCH ?? "-"}% /
                               텐트아치 ${fingerprint.debug.probabilities?.TENTED_ARCH ?? "-"}% /
                               루프 ${fingerprint.debug.probabilities?.LOOP ?? "-"}% /
                               소용돌이 ${fingerprint.debug.probabilities?.WHORL ?? "-"}%`
                            : ""
                    }
                </div>
              `
            : ""
    }

`;

previewArea.appendChild(
    fingerprintBox
);

            // 데이터 저장
            const finger =
                fingers[currentIndex];


            fingerprintImages[
    finger.key
] = {

    file: file,

    dataUrl:
        e.target.result,

    confirmed: false,

    quality:
        quality,

    detection:
        fingerprint

};

            if (!repeatCaptures[finger.key]) {
                repeatCaptures[finger.key] = [];
            }

            repeatCaptures[finger.key].push({
                dataUrl: e.target.result,
                quality,
                detection: fingerprint
            });

            if (repeatCaptures[finger.key].length > requiredCapturesPerFinger()) {
                repeatCaptures[finger.key] =
                    repeatCaptures[finger.key].slice(-requiredCapturesPerFinger());
            }

            photoActions.style.display =
                "flex";


            // 품질이 너무 낮으면
            // 사용 버튼 비활성화
            if (
                quality.level === "bad" ||
                fingerprint.tooSmall === true ||
                fingerprint.focusIssue === true
            ) {

                usePhotoBtn.disabled =
                    true;

                usePhotoBtn.style.opacity =
                    "0.5";

            } else {

                usePhotoBtn.disabled =
                    false;

                usePhotoBtn.style.opacity =
                    "1";

            }


            nextBtn.disabled =
                true;

        };

    };
    

    reader.readAsDataURL(file);

}


// ==========================================
// 다시 촬영
// ==========================================

retakeBtn.addEventListener(
    "click",
    function () {

        const finger =
            fingers[currentIndex];


        delete fingerprintImages[
            finger.key
        ];

        // 사용자가 "다시 촬영"을 누른 경우 방금 촬영값만 제거
        if (repeatCaptures[finger.key]?.length) {
            repeatCaptures[finger.key].pop();
        }


        previewArea.innerHTML =
            "촬영한 지문이 여기에 표시됩니다.";


        photoActions.style.display =
            "none";


        nextBtn.disabled =
            true;


        cameraInput.value =
            "";


        galleryInput.value =
            "";


        // 바로 카메라 실행
        cameraInput.click();

    }
);


// ==========================================
// 사진 사용
// ==========================================

usePhotoBtn.addEventListener(
    "click",
    function () {

        const finger =
            fingers[currentIndex];

        const samples = repeatCaptures[finger.key] || [];

        if (samples.length < requiredCapturesPerFinger()) {
            alert(
                `${finger.hand} ${finger.name}을 한 번 더 촬영해주세요.\n간편검사는 같은 손가락을 2회 비교합니다.`
            );

            // 첫 촬영은 보관하고 화면만 다음 촬영 상태로 초기화
            previewArea.innerHTML = "두 번째 촬영을 진행해주세요.";
            photoActions.style.display = "none";
            nextBtn.disabled = true;
            cameraInput.value = "";
            galleryInput.value = "";
            loadFinger();
            return;
        }

        const resolved = samples.map(sample => {
            const d = sample.detection || {};
            return d.effectivePattern ||
                   (d.pattern && d.pattern !== "UNKNOWN" ? d.pattern : null) ||
                   d.fallbackCandidate ||
                   null;
        });

        const agreement =
            testMode === "full"
                ? (
                    resolved.length >= 1 &&
                    !!resolved[0]
                  )
                : (
                    resolved.length === requiredCapturesPerFinger() &&
                    resolved[0] &&
                    resolved[0] === resolved[1]
                  );

        if (!agreement) {
            repeatCaptures[finger.key] = [];
            delete fingerprintImages[finger.key];

            alert(
                `${finger.hand} ${finger.name}의 두 번 판독 결과가 서로 다릅니다.\n같은 손가락을 다시 2회 촬영해주세요.`
            );

            previewArea.innerHTML = "촬영한 지문이 여기에 표시됩니다.";
            photoActions.style.display = "none";
            nextBtn.disabled = true;
            cameraInput.value = "";
            galleryInput.value = "";
            loadFinger();
            return;
        }

        fingerprintImages[finger.key].detection.effectivePattern = resolved[0];
        fingerprintImages[finger.key].detection.usedConsensus = true;
        fingerprintImages[finger.key].detection.agreementLabel =
            testMode === "simple" ? "2회 일치" : "1회 판독";


        if (!fingerprintImages[
            finger.key
        ]) {

            return;

        }


        const storedImage =
            fingerprintImages[
                finger.key
            ];

        storedImage.confirmed = true;

        if (
            storedImage.detection &&
            storedImage.detection.pattern === "UNKNOWN"
        ) {

            storedImage.detection.effectivePattern =
                storedImage.detection.fallbackCandidate ||
                (
                    storedImage.detection.debug &&
                    storedImage.detection.debug.scores
                        ? Object.entries(
                            storedImage.detection.debug.scores
                          ).sort(
                            (a, b) => b[1] - a[1]
                          )[0][0]
                        : "LOOP"
                );

            storedImage.detection.usedFallback =
                true;
        }


        photoActions.style.display =
            "none";


        nextBtn.disabled =
            false;


        previewArea.style.border =
            "1px solid #aaa";

    }
);


// ==========================================
// 다음 손가락
// ==========================================

nextBtn.addEventListener(
    "click",
    function () {

        const finger =
            fingers[currentIndex];


        const image =
            fingerprintImages[
                finger.key
            ];


        if (!image || !image.confirmed) {

            alert(
                "사진을 확인한 후 '이 사진 사용'을 눌러주세요."
            );

            return;

        }


        // 마지막 손가락
        if (
            currentIndex ===
            fingers.length - 1
        ) {

            showScreen(
                completeScreen
            );

            return;

        }


        currentIndex++;

        loadFinger();

    }
);


// ==========================================
// 분석 시작
// ==========================================

analysisBtn.addEventListener(
    "click",
    function () {

        const fingerprintData = {};

        for (const finger of fingers) {

            const imageData =
                fingerprintImages[finger.key];

            if (
                !imageData ||
                !imageData.confirmed ||
                !imageData.detection
            ) {

                alert(
                    "모든 지문이 정상적으로 등록되었는지 확인해주세요."
                );

                return;
            }

            const pattern =
                imageData.detection.effectivePattern ||
                imageData.detection.pattern;

            if (!pattern) {

                alert(
                    `${finger.hand} ${finger.name} 지문 데이터가 없습니다.`
                );

                return;
            }

            fingerprintData[finger.key] =
                pattern;
        }

        const result =
            FingerprintEngine.analyze(
                fingerprintData
            );

        renderResult(
            result,
            fingerprintData
        );

        showScreen(
            resultScreen
        );
    }
);


// ==========================================
// 결과 화면 렌더링
// ==========================================

function renderResult(
    result,
    fingerprintData
) {

    const meta = [];

    if (participant.name) {
        meta.push(participant.name);
    }

    if (participant.birth) {
        meta.push(participant.birth);
    }

    if (participant.consultant) {
        meta.push(`상담자 ${participant.consultant}`);
    }

    resultParticipant.textContent =
        meta.join(" · ");


    top3Results.innerHTML = "";

    result.top3.forEach(
        (item, index) => {

            const card =
                document.createElement("div");

            card.className =
                "top3-item";

            card.innerHTML = `
                <div class="top3-rank">
                    ${index + 1}
                </div>
                <div class="top3-name">
                    ${item.name}
                </div>
                <div class="top3-score">
                    ${item.score}점
                </div>
            `;

            top3Results.appendChild(
                card
            );
        }
    );


    intelligenceResults.innerHTML = "";

    result.ranking.forEach(
        item => {

            const row =
                document.createElement("div");

            row.className =
                "intelligence-row";

            row.innerHTML = `
                <div class="intelligence-row-head">
                    <span>${item.name}</span>
                    <strong>${item.score}</strong>
                </div>
                <div class="score-track">
                    <div
                        class="score-fill"
                        style="width:${Math.max(
                            0,
                            Math.min(100, item.score)
                        )}%"
                    ></div>
                </div>
            `;

            intelligenceResults.appendChild(
                row
            );
        }
    );


    learningStyleResult.textContent =
        result.learningStyle.description;


    fingerPatternResults.innerHTML = "";

    fingers.forEach(
        finger => {

            const patternKey =
                fingerprintData[finger.key];

            const pattern =
                FingerprintEngine.patterns[
                    patternKey
                ];

            const item =
                document.createElement("div");

            item.className =
                "finger-pattern-item";

            item.innerHTML = `
                <span>
                    ${finger.hand} ${finger.name}
                </span>
                <strong>
                    ${
                        pattern
                            ? pattern.label
                            : patternKey
                    }
                    ${
                        fingerprintImages[finger.key] &&
                        fingerprintImages[finger.key].detection &&
                        fingerprintImages[finger.key].detection.usedFallback
                            ? " (낮은 신뢰도)"
                            : ""
                    }
                </strong>
            `;

            fingerPatternResults.appendChild(
                item
            );
        }
    );
}


// ==========================================
// 새 검사
// ==========================================

restartBtn.addEventListener(
    "click",
    function () {

        currentIndex = 0;
        fingerprintImages = {};
        repeatCaptures = {};
        fingers = [...fullFingers];
        testMode = "full";

        nameInput.value = "";
        birthInput.value = "";
        consultantInput.value = "";

        previewArea.style.border = "";

        showScreen(
            startScreen
        );

        nameInput.focus();
    }
);


// ==========================================
// 결과 PDF
// ==========================================

if (pdfBtn) {
    pdfBtn.addEventListener(
        "click",
        () => {
            document.body.classList.add("printing-report");
            window.print();

            setTimeout(
                () => {
                    document.body.classList.remove("printing-report");
                },
                500
            );
        }
    );
}



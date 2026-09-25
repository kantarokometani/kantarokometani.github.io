window.addEventListener("DOMContentLoaded", () => {

    // 画面内を漂い、画面端で跳ね返るオブジェクト
    const floatingObject = document.createElement("img");
    floatingObject.src = "img/gif/inu.gif";
    floatingObject.alt = "";
    floatingObject.className = "floating-object";
    floatingObject.setAttribute("aria-hidden", "true");
    document.body.appendChild(floatingObject);

    let floatingX = 80;
    let floatingY = 120;

    let floatingVX = 1.4;
    let floatingVY = 1.4;

    let mouseX = null;
    let mouseY = null;

    const normalSpeed = 1.4;
    const escapeDistance = 160;
    const boostDistance = 70;
    const boostSpeed = 5;

    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const moveFloatingObject = () => {

        const objectWidth = floatingObject.offsetWidth;
        const objectHeight = floatingObject.offsetHeight;

        const maxX = window.innerWidth - objectWidth;
        const maxY = window.innerHeight - objectHeight;

        // GIFの中心位置
        const centerX = floatingX + objectWidth / 2;
        const centerY = floatingY + objectHeight / 2;

        // マウス位置が取得できている場合
        if (mouseX !== null && mouseY !== null) {

            const dx = centerX - mouseX;
            const dy = centerY - mouseY;

            const distance = Math.sqrt(dx * dx + dy * dy);

            // カーソルが近づいたら反対方向へ逃げる
            if (distance < escapeDistance && distance > 0) {

                const directionX = dx / distance;
                const directionY = dy / distance;

                let targetSpeed = normalSpeed;

                // かなり近づいたら急加速
                if (distance < boostDistance) {
                    targetSpeed = boostSpeed;
                }

                floatingVX += directionX * 0.18;
                floatingVY += directionY * 0.18;

                const currentSpeed = Math.sqrt(
                    floatingVX * floatingVX +
                    floatingVY * floatingVY
                );

                if (currentSpeed > targetSpeed) {
                    floatingVX =
                        (floatingVX / currentSpeed) * targetSpeed;

                    floatingVY =
                        (floatingVY / currentSpeed) * targetSpeed;
                }
            }

            // カーソルから離れたら徐々に通常速度へ戻す
            else {

                const currentSpeed = Math.sqrt(
                    floatingVX * floatingVX +
                    floatingVY * floatingVY
                );

                if (currentSpeed > normalSpeed) {
                    floatingVX *= 0.985;
                    floatingVY *= 0.985;
                }
            }
        }

        // 現在位置を進める
        floatingX += floatingVX;
        floatingY += floatingVY;

        // 左右の壁
        if (floatingX <= 0 || floatingX >= maxX) {
            floatingVX *= -1;
        }

        // 上下の壁
        if (floatingY <= 0 || floatingY >= maxY) {
            floatingVY *= -1;
        }

        floatingObject.style.transform =
            `translate3d(${floatingX}px, ${floatingY}px, 0)`;

        requestAnimationFrame(moveFloatingObject);
    };

    requestAnimationFrame(moveFloatingObject);

    // Worksページに作品の表示先があるか確認
    const worksPage = document.querySelector(
        "#music-container, #design-container"
    );

    if (!worksPage) return;

    // credits.jsonを読み込む
    fetch("js/credits.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Credits error: ${response.status}`);
            }

            return response.json();
        })
        .then(categories => {
            categories.forEach(category => {
                // JSONのsectionに対応する表示先を取得
                const targetContainer = document.querySelector(
                    `#${category.section}-container`
                );

                if (!targetContainer) {
                    console.warn(
                        `表示先が見つかりません: ${category.section}`
                    );

                    return;
                }

                let worksInnerHTML = "";

                category.works.forEach(work => {
                    // タイトルがある場合だけ表示
                    const titleHTML = work.title ? `
                        <p class="work_title">
                            <strong>${work.title}</strong>
                        </p>
                    ` : "";

                    // クレジット一覧
                    const creditListHTML = (work.credits || [])
                        .map(credit => `
                            <li class="detaillist">
                                <p>${credit}</p>
                            </li>
                        `)
                        .join("");

                    // 注釈
                    const notesHTML = (work.notes || [])
                        .map(note => `
                            <p class="note-text">${note}</p>
                        `)
                        .join("");

                    // 画像がある場合だけ表示
                    const imageHTML = work.imgSrc ? `
                        <p class="work_img">
                            <img
                                src="${work.imgSrc}"
                                alt="${work.title ? `${work.title} Artwork` : ""}"
                                loading="lazy"
                            >
                        </p>
                    ` : "";

                    // YouTube動画がある場合だけ表示
                    const youtubeTitle = work.title
                        ? `${work.title} YouTube video`
                        : "YouTube video";

                    const youtubeHTML = work.youtubeId ? `
                        <div class="youtube">
                            <iframe
                                src="https://www.youtube-nocookie.com/embed/${work.youtubeId}"
                                title="${youtubeTitle}"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen
                            ></iframe>
                        </div>
                    ` : "";

                    // 1作品分のHTML
                    worksInnerHTML += `
                        <div class="work_item">
                            ${titleHTML}
                            ${imageHTML}
                            ${youtubeHTML}

                            <div class="works_text">
                                <ul class="detail">
                                    ${creditListHTML}
                                </ul>

                                <div class="notes_box">
                                    ${notesHTML}
                                </div>
                            </div>
                        </div>
                    `;
                });

                // 1カテゴリー分のHTML
                const categoryHTML = `
                    <li class="${category.categoryClass}">
                        ${worksInnerHTML}
                    </li>
                `;

                // musicまたはdesignへ挿入
                targetContainer.insertAdjacentHTML(
                    "beforeend",
                    categoryHTML
                );
            });
        })
        .catch(error => {
            console.error("データの取得に失敗しました:", error);
        });
});

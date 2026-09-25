window.addEventListener('DOMContentLoaded', () => {
    // 1. 関係者の定義（ヘッダーとフッターの受け皿）
    const headerBox = document.querySelector('.header_box');
    const footerBox = document.querySelector('.footer_box');

    // 2. ヘッダーの読み込み
    if (headerBox) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('ヘッダーの取得失敗');
                return response.text();
            })
            .then(data => {
                headerBox.innerHTML = data;
            })
            .catch(error => console.error(error));
    }

    // 3. フッターの読み込み（同じロジックを流用）
    if (footerBox) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error('フッターの取得失敗');
                return response.text();
            })
            .then(data => {
                footerBox.innerHTML = data;
            })
            .catch(error => console.error(error));
    }
});
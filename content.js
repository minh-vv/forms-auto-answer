(async function() {
    console.log("🧠 Đang tải đáp án từ GitHub...");

    const ANSWERS_URL = "https://raw.githubusercontent.com/minh-vv/forms-auto-answer/main/answers.json";

    // 🔹 Lấy file đáp án
    let answers = [];
    try {
        const res = await fetch(ANSWERS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        answers = await res.json();
        console.log(`✅ Tải ${answers.length} đáp án thành công`);
    } catch (err) {
        console.error("❌ Lỗi tải đáp án:", err);
        return;
    }

    // ⏳ Đợi các câu hỏi hiện ra
    function waitForQuestions() {
        return new Promise(resolve => {
            const check = setInterval(() => {
                const questions = document.querySelectorAll('.office-form-question');
                if (questions.length > 0) {
                    clearInterval(check);
                    resolve(questions);
                }
            }, 1000);
        });
    }

    // 🔍 Hàm tìm đáp án gần đúng
    function findAnswer(questionText) {
        questionText = questionText.replace(/\s+/g, ' ').trim().toLowerCase();
        for (const a of answers) {
            const q = a.question.replace(/\s+/g, ' ').trim().toLowerCase();
            if (questionText.includes(q.slice(0, 20)) || q.includes(questionText.slice(0, 20))) {
                return a.ans;
            }
        }
        return null;
    }

    // 🚀 Điền đáp án
    const questions = await waitForQuestions();
    let filled = 0;

    for (const q of questions) {
        const title = q.querySelector('.office-form-question-title')?.innerText || "";
        const ans = findAnswer(title);

        if (!ans) {
            console.warn("⚠️ Không tìm thấy đáp án cho:", title);
            continue;
        }

        const options = q.querySelectorAll('.office-form-question-choice, .office-form-question-option');
        for (const opt of options) {
            const label = opt.innerText.trim().toLowerCase();
            if (label.includes(ans.toLowerCase())) {
                opt.querySelector('input')?.click();
                filled++;
                console.log(`✅ ${title.slice(0, 30)}... → ${ans}`);
                break;
            }
        }
    }

    console.log(`🎯 Hoàn thành: ${filled}/${questions.length} câu`);
})();

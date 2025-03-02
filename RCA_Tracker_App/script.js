document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbx2ELX5rCZl3pdHh6mMg0syJUgJVshyUtxTQdaz0TuHScdGa7oO1yQlyxLgdunKYKaLgA/exec";

    const loadingElement = document.getElementById("loading");
    const leaderboardBody = document.getElementById("leaderboard-data");
    const updatesList = document.getElementById("updates-list");

    async function fetchData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            loadingElement.style.display = "none"; // লোডিং অফ

            if (!data || !Array.isArray(data)) {
                throw new Error("Invalid data format");
            }

            let leaderboard = {};
            let dailyUpdates = [];

            data.forEach(entry => {
                let name = entry["  👤  নাম"] || "অজানা";
                let activeTime = entry["💬   গ্রুপে মোট কতক্ষণ সক্রিয় ছিলেন?  "] || "❌ নেই";
                let courses = entry["📚   আপনি কোন কোন কোর্সের জিম্মাদার?  "] || "❌ নেই";
                let timestamp = entry["Timestamp"] || "❌ নেই";

                // Timestamp থেকে তারিখ আলাদা করা
                let date = new Date(timestamp).toLocaleDateString("en-GB");

                // লিডারবোর্ড তৈরি
                if (!leaderboard[name]) {
                    leaderboard[name] = { name, activeTime: 0 };
                }

                // Extract hours from activeTime
                if (activeTime.includes("১ ঘণ্টা+")) leaderboard[name].activeTime += 1;
                if (activeTime.includes("২ ঘণ্টা+")) leaderboard[name].activeTime += 2;
                if (activeTime.includes("৩ ঘণ্টা+")) leaderboard[name].activeTime += 3;

                // দৈনিক আপডেট লিস্ট (Timestamp সহ)
                dailyUpdates.push(`📅 ${date} | ${name} 🕒 ${activeTime} 📚 ${courses}`);
            });

            // লিডারবোর্ড সাজানো
            let sortedLeaderboard = Object.values(leaderboard).sort((a, b) => b.activeTime - a.activeTime);

            sortedLeaderboard.forEach(user => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.activeTime} ঘন্টা</td>
                `;
                leaderboardBody.appendChild(row);
            });

            // দৈনিক আপডেট দেখানো
            dailyUpdates.forEach(update => {
                let li = document.createElement("li");
                li.textContent = update;
                updatesList.appendChild(li);
            });

        } catch (error) {
            loadingElement.textContent = "❌ ডেটা লোড করতে সমস্যা হচ্ছে!";
            console.error("Error fetching data:", error);
        }
    }

    fetchData();
});
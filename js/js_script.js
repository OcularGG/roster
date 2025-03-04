const guilds = [
    { name: "OCULAR", url: "https://albiondb.net/guild/OCULAR/" },
    { name: "OCULAR Vanguard", url: "https://albiondb.net/guild/OCULAR+Vanguard/" },
    { name: "OCULAR University", url: "https://albiondb.net/guild/OCULAR+University/" }
];

async function fetchGuildData() {
    try {
        const guildData = await Promise.all(guilds.map(guild => fetchGuildPage(guild)));
        populateTable(guildData);
    } catch (error) {
        console.error("Error fetching guild data:", error);
    }
}

async function fetchGuildPage(guild) {
    const response = await fetch(guild.url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const members = Array.from(doc.querySelectorAll('.guild-member')).map(member => ({
        name: member.querySelector('.member-name').textContent.trim(),
        rank: member.querySelector('.member-rank').textContent.trim(),
        fame: member.querySelector('.member-fame').textContent.trim(),
        guild: guild.name
    }));
    return members;
}

function populateTable(data) {
    const tableBody = document.getElementById("rosterTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear any existing rows

    data.flat().forEach(member => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.rank}</td>
            <td>${member.fame}</td>
            <td>${member.guild}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch and display the guild data when the page loads
document.addEventListener("DOMContentLoaded", fetchGuildData);

// Add event listener to the update button to force update the data
document.getElementById("updateButton").addEventListener("click", fetchGuildData);

// Ensure the data is updated every hour
setInterval(fetchGuildData, 3600000); // 3600000 ms = 1 hour
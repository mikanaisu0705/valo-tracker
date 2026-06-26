export default async function handler(req, res) {
    const { name, tag } = req.query;

    if (!name || !tag) {
        return res.status(400).json({ error: "名前とタグが必要です" });
    }

    const apiKey = process.env.VALO_API_KEY; 

    // 💡 より詳細なデータが取れる v3 MMR API に変更しました！
    const url = `https://api.henrikdev.xyz/valorant/v3/mmr/ap/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": apiKey }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "VALORANTのデータ取得に失敗しました" });
        }

        const data = await response.json();
        
        // 💡 ランク名、RR、そしてアイコン画像のURLを抜き出します
        res.status(200).json({
            rank: data.data.current_data.currenttierpatched,
            rr: data.data.current_data.ranking_in_tier,
            icon: data.data.current_data.images.small // アイコン画像のURL
        });
    } catch (error) {
        res.status(500).json({ error: "サーバーエラーが発生しました" });
    }
}
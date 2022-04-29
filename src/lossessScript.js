const getAudioInfos = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const media = new Audio(reader.result);
            let dev = 0;
            if (file.name.slice(-3) === "mp3") {
                dev = 0.06;
            }
            media.onloadedmetadata = () => resolve({
                "Продолжительность": (Math.round((media.duration - dev) * 100) / 100) + " s",
                "Размер файла": (Math.round(file.size / 125)) + " kb",
                "Битрейт": (Math.round(file.size / media.duration / 125)) + " kb/s",
            });
        };
        reader.readAsDataURL(file);
        reader.onerror = (error) => reject(error);
    });

const handleChangeIn = async (e) => {
    const infos = await getAudioInfos(e.target.files[0]);
    document.querySelector("#input_info").innerText = `Входящий файл : ${JSON.stringify(infos, null, 4)}`;
};

const handleChangeOut = async (e) => {
    const infos = await getAudioInfos(e.target.files[0]);
    document.querySelector("#output_info").innerText = `Выходящий файл : ${JSON.stringify(infos, null, 4)}`;
};
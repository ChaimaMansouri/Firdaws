const apiUrl = 'https://mp3quran.net/api/v3';
const language = 'ar';

async function getreciter(){
    const chooseReciter = document.querySelector('#reciter');
    const response = await fetch(`${apiUrl}/reciters`);
    const recitersData = await response.json();
    const reciters = recitersData.reciters;
    
    chooseReciter.innerHTML = `<option value="${reciter.id}">اختر قارئ</option>`;
    reciters.forEach(reciter => {
      chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`;
    });
    
    chooseReciter.addEventListener('change', (e) => {
        getMoshafa(e.target.value);
    });

}

getreciter( )  ;

async function getMoshafa(reciterId){

    const chooseMoshafa = document.querySelector('#moshaf');
    const response = await fetch(`${apiUrl}/reciters?language=${language}&reciter=${reciterId}`);
    const recitersData = await response.json();
    const moshafas = recitersData.reciters[0].moshaf;

    chooseMoshafa.innerHTML = `<option value="${moshaf.id}">اختر الرواية</option>`;
    moshafas.forEach(moshaf => {
        chooseMoshafa.innerHTML += `<option value="${moshaf.id}" data-server="${moshaf.server}" data-liste_sowar="${moshaf.surah_list}">${moshaf.name}</option>`;
    });
    
    chooseMoshafa.addEventListener('change', (e) => {
       const selectMoshaf=chooseMoshafa.options[chooseMoshafa.selectedIndex];


       const surah_Server=selectMoshaf.dataset.server;
       const surah_List=selectMoshaf.dataset.liste_sowar;

       getSourah(surah_Server,surah_List);
    });

}

async function getSourah(Server,surah_List){
    const chooseSourah = document.querySelector('#sourah');

    const response = await fetch(`https://mp3quran.net/api/v3/suwar`);
    const sourahData = await response.json();
    const sourah_Name = sourahData.suwar;

    surah_List=surah_List.split(',');

    chooseSourah.innerHTML = `<option value="">اختر السورة</option>`;
    surah_List.forEach(sourah_id => {
        const padsurah=sourah_id.padStart(3,'0');
       
        sourah_Name.forEach(sourah => {
            if(sourah.id==sourah_id){
                chooseSourah.innerHTML += `<option value="${Server}${padsurah}.mp3">${sourah.name}</option>`;
            }
        });
    });
    
    chooseSourah.addEventListener('change', (e) => {
       const selectSourah=chooseSourah.options[chooseSourah.selectedIndex];
       getplay(selectSourah.value)
    });
 
}

function getplay(url){
    const audio=document.querySelector('#audio');
    audio.src=url;
    audio.play();
}

function playlive(channal) {
    var video = document.getElementById('video');
    
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(channal);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });

        // Error handling in case the stream URL is not available
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                console.error("Network error: could not load playlist. Check the URL or server status.");
            }
        });
    } else {
        console.error("HLS not supported in this browser.");
    }
}









const config = {
    countriesUrl: "https://api.countrystatecity.in/v1/countries",
    citiesUrl: "https://api.countrystatecity.in/v1/countries/[ciso]/cities",
    apiKey: "ZU1UcWJvWkdndWN2NXQ5SXlFcTlZMVdiSExiZzZNMm1MeURuRFQ2ZA=="
};


async function fetchCountries() {
    try {
        const response = await axios.get(config.countriesUrl, {
            headers: { 'X-CSCAPI-KEY': config.apiKey }
        });
        const countries = response.data;
        const countrySelect = document.getElementById('Country');

      
        countrySelect.innerHTML = '<option value="" selected>اختر البلد</option>';

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.iso2;
            option.textContent = country.name;
            if (country.iso2 === "DZ") {
                option.selected = true;
            }
            countrySelect.appendChild(option);
        });

    
        fetchCities('DZ');
    } catch (error) {
        console.error("Error fetching countries:", error); 
    }
}


async function fetchCities(countryCode) {
    try {
        const url = config.citiesUrl.replace('[ciso]', countryCode);
        const response = await axios.get(url, {
            headers: { 'X-CSCAPI-KEY': config.apiKey }
        });
        const cities = response.data;
        const citySelect = document.getElementById('City');

        
        citySelect.innerHTML = '<option value="" selected>اختر المدينة</option>';

 
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            if (city.name === "Blida") {
                option.selected = true; 
            }
            citySelect.appendChild(option);
        });

       
        fetchPrayerTimes();
    } catch (error) {
        console.error("Error fetching cities:", error);
    }
}


async function fetchPrayerTimes() {
    const country = document.getElementById('Country').value;
    const cityElement = document.getElementById('City');
    const city = cityElement.options[cityElement.selectedIndex].text;

    if (country && city) {
        const params = {
            country: country,
            city: city
        };

        try {
            const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', { params: params });
            const timing = response.data.data.timings;

            document.getElementById("fajr").innerHTML = timing.Fajr;
            document.getElementById("dhuhr").innerHTML = timing.Dhuhr;
            document.getElementById("asr").innerHTML = timing.Asr;
            document.getElementById("maghrib").innerHTML = timing.Maghrib;
            document.getElementById("isha").innerHTML = timing.Isha;

            const dateStr = response.data.data.date.gregorian.date;
            const [day, month, year] = dateStr.split('-');
            const formattedDateStr = `${year}-${month}-${day}`;
            const date = new Date(formattedDateStr);
            
            if (isNaN(date.getTime())) {
                console.error('Invalid Date');
            } else {
                document.getElementById("date").innerHTML = dateStr;
            }
            
        } catch (error) {
            console.error('Error fetching prayer times:', error); 
        }
    }
}

// مستمع تغيير على قائمة البلد المنسدلة
document.getElementById('Country').addEventListener('change', (event) => {
    const countryCode = event.target.value;
    if (countryCode) {
        fetchCities(countryCode); 
    } else {
        document.getElementById('City').innerHTML = '<option value="" selected>اختر المدينة</option>';
    }
});


document.getElementById('City').addEventListener('change', fetchPrayerTimes);

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.menu ul li a');

    links.forEach(link => {
        link.addEventListener('click', function() {
           
            links.forEach(link => link.classList.remove('active'));
            
          
            this.classList.add('active');
        });
    });
});

document.querySelectorAll('.content-bottom button').forEach(button => {
    button.addEventListener('click', function() {
      
        document.querySelectorAll('.content-bottom button').forEach(btn => btn.classList.remove('active'));

        this.classList.add('active');
    });
});


const minMenuIcon = document.querySelector('.min-menu');
const menu = document.querySelector('.menu');

minMenuIcon.addEventListener('click', function() {
  
    menu.classList.toggle('active');
});


window.onload = fetchCountries;
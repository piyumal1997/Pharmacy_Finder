var json = [];

// Default table --> English Table
getData("english");
getDistrictResults("english");
getProvinceResults("english");

// Default table --> Sinhala, Tamil Table
$("#languageDropdown a").click(function (event) {
  var language = this.textContent;
  console.log(language);
  $("#table tbody").html("");
  getData(language);
  getDistrictResults(language);
  getProvinceResults(language);
  changeDistrictLanguage(language);
});

// English/Sinhala/Tamil Tables display function
function getData(language) {
  $.getJSON(`Data/${language}.json`, function (data) {
    var pharmacy = [];
    $.each(data, function (key, value) {
      console.log(key, value);
      pharmacy += "<tr>";

    

      pharmacy += "<td>" + value.District + "</td>";

      pharmacy += "<td>" + value.Name + "</td>";

      pharmacy += "<td>" + value.Address + "</td>";

      pharmacy += "<td>" + value.Phone + "</td>";

      pharmacy += "<td>" + value.WhatsApp + "</td>";

      pharmacy += "<td>" + value.Viber + "</td>";

      pharmacy += "<td>" + value.MoH + "</td>";

      pharmacy += "</tr>";
    });
    json = data;
    $("#table tbody").append(pharmacy);
  });
}

// filter dictrict by English, Sinhala and Tamil languages
function getDistrictResults(language) {
  $("#districtButtons button").click(function (event) {
    var districtVal = this.textContent;
    if (language.includes("sinhala")) {
      filteredTableByDisctrict(districtVal);
    } else if (language.includes("tamil")) {
      filteredTableByDisctrict(districtVal);
    } else {
      filteredTableByDisctrict(districtVal);
    }
  });
}

// filter province by English, Sinhala and Tamil languages
function getProvinceResults(language) {
  $("#provinceDropdown li a").click(function (event) {
    var provinceVal = this.textContent;
    if (language.includes("sinhala")) {
      if (provinceVal.includes("බස්නාහිර")) {
        filteredTableByDisctrict("කොළඹ", "ගම්පහ", "කළුතර");
      } else if (provinceVal.includes("දකුණ")) {
        filteredTableByDisctrict("ගාල්ල", "හම්බන්තොට", "මාතර");
      } else if (provinceVal.includes("මධ්‍යම")) {
        filteredTableByDisctrict("මහනුවර", "මාතලේ", "නුවරඑලිය");
      } else if (provinceVal.includes("සබරගමුව")) {
        filteredTableByDisctrict("කෑගල්ල", "රත්නපුර");
      } else if (provinceVal.includes("උතුරු මැද")) {
        filteredTableByDisctrict("අනුරාධපුර", "පොළොන්නරුව");
      } else if (provinceVal.includes("ඌව")) {
        filteredTableByDisctrict("බදුල්ල", "මොණරගල");
      } else if (provinceVal.includes("වයඹ")) {
        filteredTableByDisctrict("කුරුණෑගල", "පුත්තලම");
      } else if (provinceVal.includes("නැගෙනහිර")) {
        filteredTableByDisctrict("අම්පාර", "මඩකලපුව", "ත්රිකුණාමලය");
      } else if (provinceVal.includes("උතුර")) {
        filteredTableByDisctrict("යාපනය", "මුලතිව්", "වවුනියාව");
      }
    } else if (language.includes("tamil")) {
      if (provinceVal.includes("மேற்கு")) {
        filteredTableByDisctrict("கொழும்பு", "கம்பஹா", "களுத்துறை");
      } else if (provinceVal.includes("தெற்கு")) {
        filteredTableByDisctrict("காலி", "அம்பாந்தோட்டை", "மாத்தறை");
      } else if (provinceVal.includes("மத்திய")) {
        filteredTableByDisctrict("கண்டி", "மாத்தளை", "நுவரெலியா");
      } else if (provinceVal.includes("சப்ரகமுவா")) {
        filteredTableByDisctrict("கேகாலை", "இரத்தினபுரி");
      } else if (provinceVal.includes("வட மையம்")) {
        filteredTableByDisctrict("அனுராதபுரம்", "பொலன்னறுவை");
      } else if (provinceVal.includes("திராட்சை")) {
        filteredTableByDisctrict("பதுளை", "மொனராகல");
      } else if (provinceVal.includes("வடமேற்கு")) {
        filteredTableByDisctrict("குருநாகல்", "புத்தளம்");
      } else if (provinceVal.includes("கிழக்கு")) {
        filteredTableByDisctrict("அம்பாறை", "மட்டக்களப்பு", "திருகோணமலை");
      } else if (provinceVal.includes("வடக்கு")) {
        filteredTableByDisctrict("யாழ்ப்பாணம்", "முல்லைத்தீவு", "வவுனியா");
      }
    } else {
      if (provinceVal.includes("Western")) {
        filteredTableByDisctrict("Colombo", "Gampaha", "Kalutara");
      } else if (provinceVal.includes("Southern")) {
        filteredTableByDisctrict("Galle", "Hambantota", "Matara");
      } else if (provinceVal.includes("Central")) {
        filteredTableByDisctrict("Kandy", "Matale", "Nuwara-Eliya");
      } else if (provinceVal.includes("Sabaragamuwa")) {
        filteredTableByDisctrict("Kegalle", "Ratnapura");
      } else if (provinceVal.includes("Northcentral")) {
        filteredTableByDisctrict("Anuradhapura", "Polonnaruwa");
      } else if (provinceVal.includes("Uva")) {
        filteredTableByDisctrict("Badulla", "Monaragala");
      } else if (provinceVal.includes("Northwestern")) {
        filteredTableByDisctrict("Kurunegala", "Puttalam");
      } else if (provinceVal.includes("Eastern")) {
        filteredTableByDisctrict("Ampara", "Batticaloa", "Trincomalee");
      } else if (provinceVal.includes("Northern")) {
        filteredTableByDisctrict("Jaffna", "Mullaitivu", "Vavuniya");
      }
    }
  });
}

// English/Sinhala/Tamil languages dictrict filter
function filteredTableByDisctrict(
  districtVal,
  districtValSecond,
  districtValThird
) {
  var districts = [];
  var District = "District";
  $("#table tbody").html("");
  for (var i = 0; i < json.length; i++) {
    if (
      json[i][District].includes(districtVal) ||
      json[i][District].includes(districtValSecond) ||
      json[i][District].includes(districtValThird)
    ) {
      filterDataForDistrict();
    }
    function filterDataForDistrict()
    {
      var district_data = "";
      district_data += "<tr>";
      district_data += "<td>" + json[i].District + "</td>";
      district_data += "<td>" + json[i].Name + "</td>";
      district_data += "<td>" + json[i].Address + "</td>";
      district_data += "<td>" + json[i].Phone + "</td>";
      district_data += "<td>" + json[i].WhatsApp + "</td>";
      district_data += "<td>" + json[i].Viber + "</td>";
      district_data += "<td>" + json[i].MoH + "</td>";
      district_data += "</tr>";

      districts.push(district_data);
      $("#table tbody").append(district_data);
    }
  }
}

// search function -- only English
function filteredTable() {
  var results = [];
  var District = "District";
  var id = "id";
  var Name = "Name";
  var Address = "Address";
  var MOH = "MoH";
  var searchVal = document.getElementById("search").value.toLowerCase();
  $("#table tbody").html("");
  for (var i = 0; i < json.length; i++) 
  {
    if (json[i][District].toLowerCase().includes(searchVal)) 
    {
      filterData();
    }
     else if (json[i][id].toLowerCase().includes(searchVal)) 
    {
      filterData();
    } 
    else if (json[i][Name].toLowerCase().includes(searchVal)) 
    {
      filterData();
    } 
    else if (json[i][Address].toLowerCase().includes(searchVal))
    {
      filterData();
    } 
    else if (json[i][MOH].toLowerCase().includes(searchVal)) 
    {
      filterData();
    }

    function filterData() 
    {
      var newroutes_data = "";
      newroutes_data += "<tr>";
      newroutes_data += "<td>" + json[i].id + "</td>";
      newroutes_data += "<td>" + json[i].District + "</td>";
      newroutes_data += "<td>" + json[i].Name + "</td>";
      newroutes_data += "<td>" + json[i].Address + "</td>";
      newroutes_data += "<td>" + json[i].Phone + "</td>";
      newroutes_data += "<td>" + json[i].WhatsApp + "</td>";
      newroutes_data += "<td>" + json[i].Viber + "</td>";
      newroutes_data += "<td>" + json[i].MoH + "</td>";
      newroutes_data += "</tr>";

      results.push(newroutes_data);
      $("#table tbody").append(newroutes_data);
    }
  }
}

// change district buttons and province dropdown by sinhala, tamil and english language
function changeDistrictLanguage(language) 
{
  if (language.includes("sinhala")) {
    // change button names when select sinhala language
    document.getElementById("provinceSelector").textContent = "පලාත තෝරන්න";
    document.getElementById("languageSelector").textContent = "භාශාව තෝරන්න";
    document.getElementById("search").placeholder =
      "ෆාමසියේ නමින්, නගරයකින්, ගමකින් ඔබේ ෆාමසිය සොයන්න...";
    // change district names when select sinhala language
    document.getElementById("Ampara").textContent = "අම්පාර";
    document.getElementById("Anuradhapura").textContent = "අනුරාධපුර";
    document.getElementById("Badulla").textContent = "බදුල්ල";
    document.getElementById("Batticaloa").textContent = "මඩකලපුව";
    document.getElementById("Colombo").textContent = "කොළඹ";
    document.getElementById("Galle").textContent = "ගාල්ල";
    document.getElementById("Gampaha").textContent = "ගම්පහ";
    document.getElementById("Hambantota").textContent = "හම්බන්තොට";
    document.getElementById("Jaffna").textContent = "යාපනය";
    document.getElementById("Kalutara").textContent = "කළුතර";
    document.getElementById("Kandy").textContent = "මහනුවර";
    document.getElementById("Kegalle").textContent = "කෑගල්ල";
    document.getElementById("Kurunegala").textContent = "කුරුණෑගල";
    document.getElementById("Matale").textContent = "මාතලේ";
    document.getElementById("Matara").textContent = "මාතර";
    document.getElementById("Monaragala").textContent = "මොණරගල";
    document.getElementById("Mullaitivu").textContent = "මුලතිව්";
    document.getElementById("Nuwara-Eliya").textContent = "නුවරඑලිය";
    document.getElementById("Polonnaruwa").textContent = "පොළොන්නරුව";
    document.getElementById("Puttalam").textContent = "පුත්තලම";
    document.getElementById("Ratnapura").textContent = "රත්නපුර";
    document.getElementById("Trincomalee").textContent = "ත්රිකුණාමලය";
    document.getElementById("Vavuniya").textContent = "වවුනියාව";
    // change province names when select sinhala language
    document.getElementById("Western").textContent = "බස්නාහිර";
    document.getElementById("Southern").textContent = "දකුණ";
    document.getElementById("Central").textContent = "මධ්‍යම";
    document.getElementById("Sabaragamuwa").textContent = "සබරගමුව";
    document.getElementById("NorthCentral").textContent = "උතුරු මැද";
    document.getElementById("Uva").textContent = "ඌව";
    document.getElementById("NorthWestern").textContent = "වයඹ";
    document.getElementById("Eastern").textContent = "නැගෙනහිර";
    document.getElementById("Northern").textContent = "උතුර";
  } else if (language.includes("tamil")) {
    // change button names when select tamil language
    document.getElementById("provinceSelector").textContent = "மாகாணத்தைத்";
    document.getElementById("languageSelector").textContent =
      "மொழியை தேர்ந்தெடுங்கள்";
    document.getElementById("search").placeholder =
      "மருந்தகம், நகரம் அல்லது கிராமத்தின் பெயரால் உங்கள் மருந்தகத்தைக் கண்டறியவும் ...";
    // change district names when select tamil language
    document.getElementById("Ampara").textContent = "அம்பாறை";
    document.getElementById("Anuradhapura").textContent = "அனுராதபுரம்";
    document.getElementById("Badulla").textContent = "பதுளை";
    document.getElementById("Batticaloa").textContent = "மட்டக்களப்பு";
    document.getElementById("Colombo").textContent = "கொழும்பு";
    document.getElementById("Galle").textContent = "காலி";
    document.getElementById("Gampaha").textContent = "கம்பஹா";
    document.getElementById("Hambantota").textContent = "அம்பாந்தோட்டை";
    document.getElementById("Jaffna").textContent = "யாழ்ப்பாணம்";
    document.getElementById("Kalutara").textContent = "களுத்துறை";
    document.getElementById("Kandy").textContent = "கண்டி";
    document.getElementById("Kegalle").textContent = "கேகாலை";
    document.getElementById("Kurunegala").textContent = "குருநாகல்";
    document.getElementById("Matale").textContent = "மாத்தளை";
    document.getElementById("Matara").textContent = "மாத்தறை";
    document.getElementById("Monaragala").textContent = "மொனராகல";
    document.getElementById("Mullaitivu").textContent = "முல்லைத்தீவு";
    document.getElementById("Nuwara-Eliya").textContent = "நுவரெலியா";
    document.getElementById("Polonnaruwa").textContent = "பொலன்னறுவை";
    document.getElementById("Puttalam").textContent = "புத்தளம்";
    document.getElementById("Ratnapura").textContent = "இரத்தினபுரி";
    document.getElementById("Trincomalee").textContent = "திருகோணமலை";
    document.getElementById("Vavuniya").textContent = "வவுனியா";
    // change province names when select tamil language
    document.getElementById("Western").textContent = "மேற்கு";
    document.getElementById("Southern").textContent = "தெற்கு";
    document.getElementById("Central").textContent = "மத்திய";
    document.getElementById("Sabaragamuwa").textContent = "சப்ரகமுவா";
    document.getElementById("NorthCentral").textContent = "வட மையம்";
    document.getElementById("Uva").textContent = "திராட்சை";
    document.getElementById("NorthWestern").textContent = "வடமேற்கு";
    document.getElementById("Eastern").textContent = "கிழக்கு";
    document.getElementById("Northern").textContent = "வடக்கு";
  } else if (language.includes("english")) {
    // change button names when select english language
    document.getElementById("provinceSelector").textContent = "Select Province";
    document.getElementById("languageSelector").textContent = "Select Language";
    document.getElementById("search").placeholder =
      "Search By District, Pharmacy Name, Address or MOH...";
    // change district names when select english language
    document.getElementById("Ampara").textContent = "Ampara";
    document.getElementById("Anuradhapura").textContent = "Anuradhapura";
    document.getElementById("Badulla").textContent = "Badulla";
    document.getElementById("Batticaloa").textContent = "Batticaloa";
    document.getElementById("Colombo").textContent = "Colombo";
    document.getElementById("Galle").textContent = "Galle";
    document.getElementById("Gampaha").textContent = "Gampaha";
    document.getElementById("Hambantota").textContent = "Hambantota";
    document.getElementById("Jaffna").textContent = "Jaffna";
    document.getElementById("Kalutara").textContent = "Kalutara";
    document.getElementById("Kandy").textContent = "Kandy";
    document.getElementById("Kegalle").textContent = "Kegalle";
    document.getElementById("Kurunegala").textContent = "Kurunegala";
    document.getElementById("Matale").textContent = "Matale";
    document.getElementById("Matara").textContent = "Matara";
    document.getElementById("Monaragala").textContent = "Monaragala";
    document.getElementById("Mullaitivu").textContent = "Mullaitivu";
    document.getElementById("Nuwara-Eliya").textContent = "Nuwara-Eliya";
    document.getElementById("Polonnaruwa").textContent = "Polonnaruwa";
    document.getElementById("Puttalam").textContent = "Puttalam";
    document.getElementById("Ratnapura").textContent = "Ratnapura";
    document.getElementById("Trincomalee").textContent = "Trincomalee";
    document.getElementById("Vavuniya").textContent = "Vavuniya";
    // change province names when select english language
    document.getElementById("Western").textContent = "Western";
    document.getElementById("Southern").textContent = "Southern";
    document.getElementById("Central").textContent = "Central";
    document.getElementById("Sabaragamuwa").textContent = "Sabaragamuwa";
    document.getElementById("NorthCentral").textContent = "Northcentral";
    document.getElementById("Uva").textContent = "Uva";
    document.getElementById("NorthWestern").textContent = "Northwestern";
    document.getElementById("Eastern").textContent = "Eastern";
    document.getElementById("Northern").textContent = "Northern";
  }
}

// Display two(language and province dropdowns)
$("#dropdownForLanguage").click(function () {
  $("#languageDropdown").toggleClass("show");
});

$("#dropdownForProvince").click(function () {
  $("#provinceDropdown").toggleClass("show");
});

//NavBar Collapse
let hamMenuIcon = document.getElementById("ham-menu");
let navBar = document.getElementById("nav-bar");
let navLinks = navBar.querySelectorAll("li");

hamMenuIcon.addEventListener("click", () => {
  navBar.classList.toggle("active");
  hamMenuIcon.classList.toggle("fa-times");
});
navLinks.forEach((navLinks) => {
  navLinks.addEventListener("click", () => {
    navBar.classList.remove("active");
    hamMenuIcon.classList.toggle("fa-times");
  });
});

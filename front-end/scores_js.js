//
let scoreWindow = document.querySelector('.scoreWindow')
//sort contact list by score
const sortListByScore = (list) => {
  return list.sort((a, b) => {
      return a[2] - b[2];
    });
}
//fetch data from server
fetch('/scoreData', {
    method: 'GET', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  //create table with the given data
  .then(result => {
    console.log(result);
    let data = result['data'];
    data = sortListByScore(data);
    scoreWindow.innerHTML = ``;
    scoreWindow.innerHTML += `
    <tr>
      <th>score_ID</th>
      <th>user_name</th>
      <th>score</th>
    </tr>`
    Object.keys(data).forEach(key=>{
        let gameID = data[key][0];
        let userName = data[key][1];
        let gameScore = data[key][2];
        scoreWindow.innerHTML += `
          <tr class="score">
              <td>${gameID}</td>
              <td>${userName}</td>
              <td>${gameScore}</td>
          </tr>
        `
    })
    
  });
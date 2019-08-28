let team_count = document.querySelector('#teamCount');
let members = document.querySelector('#members');
console.log("js added");
team_count.addEventListener("input",function(e){
    num = team_count.value;
    let html = "";
    for(let i=2;i<=num;i++)
    {
        html += `<div class="form-group input-group">
        <div class="input-group-prepend bg-success text-white pl-3 pr-3 pt-2" style="font-size:20px"><i class="fa fa-user" ></i></div>
        <input type="text" name="member${i}" placeholder="Enter Member${i} Name" class="form-control" />
</div>`
    }
    members.innerHTML = html;
});

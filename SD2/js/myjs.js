var up_down_colorlist = new Object();
up_down_colorlist['up'] = d3.rgb(242,192,192);
//up_down_colorlist['up'] = d3.rgb(255,153,153);

//up_down_colorlist['up'] = d3.rgb(251,128,114);
//up_down_colorlist['down'] = "steelblue";

// selected up_down_colorlist['down'] = d3.rgb(153,204,255);
up_down_colorlist['down'] = d3.rgb(110, 177, 211);
//up_down_colorlist['down'] = d3.rgb(128,177,211);

var Delete_color = "red";
//var Clickable_color = d3.rgb(211,232,214);
var Clickable_color = d3.rgb(102, 184, 100);
//var Clickable_color = d3.rgb(162, 171, 88);

var Clickable_name_color = "black";
var Unclickable_name_color = "darkgray";

var has_names = ['Jiawei Han', 'Xifeng Yan', 'Yizhou Sun', 'Christos Faloutsos', 'Jure Leskovec', 'Hanghang Tong'];
// var has_names = ['Huamin Qu', 'Yingcai Wu', 'Nan Cao']

var getElementsByTagName = function(tag, name){
    returns = new Array();
    var e = document.getElementsByTagName(tag);
    for(var i = 0; i < e.length; i++){
        if(e[i].getAttribute("name") == name){
            returns[returns.length] = e[i];
        }
    }
    return returns;
}

function find(str,cha,num){
    var x=str.indexOf(cha);
    for(var i=1;i<num;i++){
        x=str.indexOf(cha,x+1);
    }
    return x;
}

function Remove_nodechildren(id){
    var parent = document.getElementById(id)
    var childrens = parent.childNodes;
    if(childrens != ''){
        for(var i = childrens.length-1; i >=0; i--)
        {
        parent.removeChild(childrens[i]);
        }
    }
}

var c_width = document.documentElement.clientWidth || document.body.clientWidth;
var c_height = document.documentElement.clientHeight || document.body.clientHeight;

var NUM_GRAPHS = 0;
var author_list_all = new Object();
var author_list = new Array();

var change_event = 0;
var select_events = new Array();
var full_names = new Array();


// d3.select('#change_Event').on("mouseover", function(){d3.select(this).style("cursor", "pointer")});
// function changeEvent(){
//     if(change_event % 2 == 0){
//         document.getElementById("change_Event").innerText = "Venue Name";
//     }
//     else{
//         document.getElementById("change_Event").innerText = "Author Name";
//     }
//     change_event += 1;
// }

d3.select("#header_question")
    .on("mouseover", function(){
        d3.select(this)
        .style("text-decoration", "underline")
        .style("cursor", "pointer");
    })
    .on("mouseout", function(){
        d3.select(this)
        .style("text-decoration", "none");
    });

d3.select("#author_name")
    .on("change", function(){
        var sect = document.getElementById("author_name");
        var name = sect.options[sect.selectedIndex].value;
        
        var number = 0;

        if(name.indexOf("citations") > -1){
            number = 1;
        }
        select_events.push(0);
        (function() {
            //var test = "http://98.220.5.15:1234/user";
            var test = "http://140.82.48.134:1234/user";
            $.getJSON( test, {
                num : number,
                name: name
            })
                .done(function( data ) {
                    if(data['num'] == '0'){
                    if(Object.getOwnPropertyNames(author_list_all).length == 0){
                        addPanel();
                    }
                    author_list_all[data['name']] = data['sum'];
                    full_names.push(data['name'])
                    console.log(author_list_all)
                    updateUsedSets(author_list_all);
                    updateSetsLabels(author_list_all);
                    show_coauthors(data['co_authors']);
                    sect.selectedIndex = 0;
                } 
                    else{
                        alert("Please enter the right author name");
                    }
                });
        })(); 
    })

d3.select("#venue_name")
    .on("change", function(){
        var sect = document.getElementById("venue_name");
        var name = sect.options[sect.selectedIndex].value;

        select_events.push(1);
        var number = 7;
        (function() {
            //var test = "http://98.220.5.15:1234/user";
            var test = "http://140.82.48.134:1234/user";
            $.getJSON( test, {
                num : number,
                name: name
            })
                .done(function( data ) {
                    if(data['num'] == '0'){
                    if(Object.getOwnPropertyNames(author_list_all).length == 0){
                        addPanel();
                    }
                    author_list_all[data['name']] = data['sum'];
                    full_names.push(data['venue'])
                    console.log(author_list_all)
                    updateUsedSets(author_list_all);
                    updateSetsLabels(author_list_all);
                    show_coauthors(data['co_authors']);
                    sect.selectedIndex = 0;
                } 
                    else{
                        alert("Please enter the right venue name");
                    }
                });
        })(); 
    })

function addName()
{
    var input = document.getElementById("author_name");
    var name = input.value;
    input.value = "";
    var number = 0;

    if(name.indexOf("citations") > -1){
        number = 1;
    }
    select_events.push(0);
    (function() {
        //var test = "http://98.220.5.15:1234/user";
        var test = "http://140.82.48.134:1234/user";
        $.getJSON( test, {
            num : number,
            name: name
        })
            .done(function( data ) {
                if(data['num'] == '0'){
                if(Object.getOwnPropertyNames(author_list_all).length == 0){
                    addPanel();
                }
                author_list_all[data['name']] = data['sum'];
                full_names.push(data['name'])
                console.log(author_list_all)
                updateUsedSets(author_list_all);
                updateSetsLabels(author_list_all);
                show_coauthors(data['co_authors']);
            } 
                else{
                    alert("Please enter the right author name");
                }
            });
    })(); 
}

function addVenueName(){
    var input = document.getElementById("venue_name");
    var name = input.value;
    input.value = "";

    select_events.push(1);
    var number = 7;
    (function() {
        //var test = "http://98.220.5.15:1234/user";
        var test = "http://140.82.48.134:1234/user";
        $.getJSON( test, {
            num : number,
            name: name
        })
            .done(function( data ) {
                if(data['num'] == '0'){
                if(Object.getOwnPropertyNames(author_list_all).length == 0){
                    addPanel();
                }
                author_list_all[data['name']] = data['sum'];
                full_names.push(data['venue'])
                console.log(author_list_all)
                updateUsedSets(author_list_all);
                updateSetsLabels(author_list_all);
                show_coauthors(data['co_authors']);
            } 
                else{
                    alert("Please enter the right venue name");
                }
            });
    })(); 
}

function addCoauthor(urlname, name){
    var num = 2;
    (function() {
        //var test = "http://98.220.5.15:1234/user";
        var test = "http://140.82.48.134:1234/user";
        $.getJSON( test, {
            num : num,
            urlname: urlname,
            name: name
        })
          .done(function( data ) {
                if(data['num'] == '0'){
                    if(Object.getOwnPropertyNames(author_list_all).length == 0){
                        addPanel();
                    }
                    if(author_list_all.hasOwnProperty(data['name'])){
                    }
                    else{
                        author_list_all[data['name']] = data['sum'];
                        select_events.push(0)
                        full_names.push(data['name'])
                        console.log(author_list_all)
                        updateUsedSets(author_list_all);
                        updateSetsLabels(author_list_all);
                        show_coauthors(data['co_authors']);
                    }
                }
                else{
                    alert("Please enter the right name");
                }
          });
    })(); 
}

var headerSVG_s = d3.select('#headerVis').select('svg')
                .append("g")
                .attr("class", "setSelection")
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

var usedSetsViss =   headerSVG_s.append("g")
                .attr("id", "usedsets")
                .attr("transform", "translate(0,7)");

function updateUsedSets(author_list_all) {
    var differenceForMultiSel = 7;
    var textHeight = 62-differenceForMultiSel;
    var cellDistance = 20;
    var cellSize = cellDistance;

    var sum_list = new Array();
    Object.keys(author_list_all).forEach(function(key){
        sum_list.push(author_list_all[key]);
    });

    var setSizeScale = d3.scale.linear().domain([0, d3.max(sum_list, function (d) {
        return d;
    })]).nice().range([0, textHeight]);

    Remove_nodechildren("usedsets")
    
    var usedSetsVis =  usedSetsViss.selectAll("setLabel")
                        .data(sum_list)
                        .enter()
                        .append("g")
                        .attr("class", "setLabel")
                        .attr("transform", function (d, i) {
                                return 'translate(' + (cellDistance * (i )) + ', 0)'
                        })
                        .attr("opacity", 1);
    
    usedSetsVis.append('rect')
                .attr("class", 'setSizeBackground')
                .attr("height", (textHeight + 1))
                .attr("width", cellSize)
                .attr("opacity", 1)
                .attr("fill", d3.rgb(240,240,240));
                
    // background bar
    usedSetsVis.append('rect')
                .attr("class", 'setSizeRect setSize')
                .attr("x", 1)
                .attr("width", (cellSize - 2))
                .attr("style", "stroke:white")
                .attr("style", "fill:darkgray")
                .data(sum_list)
                .attr("y",function (d) {
                    return (textHeight - (setSizeScale(d)));
                })
                .attr("height", function (d) {
                    return setSizeScale(d);
                });

    usedSetsVis.append("text")
                .attr("class", "setSizeText")
                .attr("x", 0)
                .attr("y", 5)
                .data(Object.keys(author_list_all))
                .text("x")
                .attr("font-family", "Arial")
                .attr("font-size", 13)
                .style("fill", Delete_color)
                .on("mouseover", function(){
                    d3.select(this).style("cursor", "pointer").style("fill", "orange");
                })
                .on("mouseout", function(){
                    d3.select(this).style("fill", Delete_color);
                })
                .on("click", function(d, i){
                    delete author_list_all[d]
                    author_list.splice(i, 1); 
                    full_names.splice(i,1);

                    if(ADD_panel_num % 2 == 1){
                        removeLogicPanel();
                        d3.select("#logic_panel_rec").style("fill", "url(#AndPattern)");
                    }
                    ADD_panel_num += 1;

                    for(var uid in histogram_list){
                        if(histogram_list[uid].select_circles.length >= (i+1)){
                            if(histogram_list[uid].select_circles[i] != 2){
                                removeGraph(uid);
                            }
                            else{
                                histogram_list[uid].select_circles.splice(i, 1);
                            }
                        }
                    }

                    if(author_list.length == 0){
                        Remove_nodechildren("name_rec");
                        Remove_nodechildren("unused_name_rec");
                        Remove_nodechildren("usedsets");
                        Remove_nodechildren("unusedsets");
                        var parent = document.getElementById("num_list")
                        var childrens = parent.childNodes;
                        if(childrens != ''){
                            for(var i = childrens.length-1; i >=0; i--)
                            {
                                if(childrens[i].className.animVal == "logicAddButton"){
                                    parent.removeChild(childrens[i]);
                                }
                            }
                        }
                                        }
                    else{
                        updateUsedSets(author_list_all);
                        updateSetsLabels();
                        change_show_coauthor(author_list[author_list.length-1]);
                    }
                    console.log(d);
                    console.log(i);
                });

}

var headerSVG_second = d3.select('#headerVis').select('svg')
                .append("g")
                .attr("class", "tableHeader")
                .attr("transform", "translate(" + 90 + "," + 65 + ")");

var headerSVG_t = headerSVG_second.append("g")
                .attr("class", "usedtables")
                .attr("id", "name_rec")
                .attr("transform", "translate(0,0)");

function updateSetsLabels() {
    var cellDistance = 20;
    var leftOffset = 90;
    var textHeight = 90;
    var textSpacing = 3;

    author_list = [];
    Object.keys(author_list_all).forEach(function(key){
        author_list.push(key);
    });
    
    Remove_nodechildren("name_rec")

    var setRows = headerSVG_t.selectAll("setRow")
                .data(author_list);

        setRows.exit().remove();

        setRows.enter()
                .append("g")
                .attr("class", "setRow")
                .attr("transform", function (d, i) {
                    return 'translate(' + (cellDistance * (i )) + ', 0)'
                });
        
        

        setRows.append('rect')
                .attr("class", 'sortBySet connection vertical')
                .attr("height", (textHeight-2))
                .attr("width", cellDistance)
                .style("opacity", 1)
                .attr("fill", d3.rgb(240,240,240))
                .attr("stroke", "white")
                .attr("transform", function (d, i) {
                        return 'skewX(45) translate(' + (- leftOffset) + ', 0)';
                });

        setRows.append('text')
                .text(function(d){
                    return d;
                })
                .attr("class", 'setLabel')
                .attr("id", function(d){
                    return d;
                })
                .attr("text-anchor", "end")
                .attr("font-family", "Arial")
                .attr("font-size", 12)
                .attr("transform", function (d, i) {
                    return 'translate(0,' + (textHeight - textSpacing - 2) + ')rotate(45)';
                })
                .attr("fill", function(){
                    d3.selectAll("text.setLabel")
                    .attr("fill", Clickable_name_color);
                    return "orange";
                })
                .on("click", function(d){
                    change_show_coauthor(d);
                    d3.selectAll("text.setLabel")
                    .attr("fill", Clickable_name_color);

                    d3.select(this)
                    .attr("fill", "orange");
                })
                .on("mouseover", function(){
                    d3.select(this)
                        .style("cursor", "pointer");
                })
                .append("svg:title")
                .text(function (d, i) {
                    return d;
                });

}

var ADD_panel_num = 0
function addPanel()
{
    defineCirclePatterns(headerSVG_s, 12);

    var headerSVG_ad = d3.select('#headerVis').select('svg')
                .append("g")
                .attr("class", "logicAddButton")
                .attr("transform", "translate(" + 0 + "," + 135 + ")")
                .attr("opacity", 1);

    headerSVG_ad.append("rect")
                .attr("id", "logic_panel_rec")
                .attr("width", 20)
                .attr("height", 20)
                .attr("x", 0)
                .attr("y", 0)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", "url(#AndPattern)")//"rgb(161,217,155)")
                .style("opacity", 0.5)
                .style("cursor", "pointer")
                .on("mouseover", function(){
                    d3.select(this)
                        .style("opacity", 1);
                    if(ADD_panel_num % 2 == 0){
                        add_hints("addPanel");
                    }
                    else{
                        add_hints("removePanel");
                    }
                })
                .on("mouseout", function(){
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .style("opacity", 0.5);
                    remove_hints();
                })
                .on("click", function(){
                    remove_hints();
                    if(ADD_panel_num % 2 == 0){
                        addLogicPanel();
                        d3.select(this).style("fill", "url(#NotPattern)");
                    }
                    else{
                        removeLogicPanel();
                        d3.select(this).style("fill", "url(#AndPattern)");
                    }
                    ADD_panel_num += 1;
                });

    // headerSVG_ad.append("text")
    //             .attr("class", "addButton")
    //             .attr("x", 25)
    //             .attr("y", 10)
    //             .style("fill", "black")
    //             .style("text-anchor", "start")
    //             .style("cursor", "auto");
    //             .text("add")
    //             .attr("font-size", 13);
}

function change_show_coauthor(name){
    var number = 4;

    (function() {
        //var test = "http://98.220.5.15:1234/user";
        var test = "http://140.82.48.134:1234/user";
        $.getJSON( test, {
            num : number,
            name: name
        })
          .done(function( data ) {
              if(data['num'] == '0'){
                show_coauthors(data['co_authors']);
            }
              else{
                  alert("There is no coauthors.");
              }
          });
    })(); 
}

var unusedSets = headerSVG_s.append("g")
                            .attr("id", "unusedsets")
                            .attr("transform", "translate(150,7)");

var unused_headerSVG_tables = headerSVG_second.append("g")
                            .attr("class", "unusetables")
                            .attr("id", "unused_name_rec")
                            .attr("transform", "translate(150,0)");

function show_coauthors(co_authors_list){
    if(select_events.length > 6){
        d3.select("#unusedsets")
        .attr("transform", function(){
            return "translate(" + (150 + 20*(select_events.length - 6)) + ",7)";
        })

        d3.select("#unused_name_rec")
        .attr("transform", function(){
            return "translate(" + (150 + 20*(select_events.length - 6)) + ",0)";
        })
    }
    var co_authors = new Array();
    for(var j=0; j < co_authors_list.length; j ++){
        if(j <= 14){
            co_authors.push(co_authors_list[j]);
        }
        else{
            break;
        }
    };
    //console.log("coauthors_len     :" + JSON.stringify(co_authors))

    var differenceForMultiSel = 7;
    var textHeight = 62-differenceForMultiSel;
    var cellDistance = 20;
    var cellSize = cellDistance;

    var sum_list = new Array();
    for(var j=0; j < co_authors.length; j ++){
        sum_list.push(co_authors[j]['paper_num']);
    };

    var max_num = d3.max(sum_list);

    var co_sum_list = new Array();
    for(var j=0; j < co_authors.length; j ++){
        co_sum_list.push(co_authors[j]['co_paper_num']);
    };

    var setSizeScale = d3.scale.linear().domain([0, max_num]).nice().range([0, textHeight]);

    Remove_nodechildren("unusedsets");
    
    var unusedSetsVis =  unusedSets.selectAll("setLabel")
                        .data(sum_list)
                        .enter()
                        .append("g")
                        .attr("class", "setLabel")
                        .attr("transform", function (d, i) {
                                return 'translate(' + (cellDistance * (i )) + ', 0)'
                        })
                        .attr("opacity", 1);
    
    unusedSetsVis.append('rect')
                .attr("class", 'setSizeBackground')
                .attr("height", (textHeight + 1))
                .attr("width", cellSize)
                .attr("opacity", 1)
                .attr("fill", d3.rgb(240,240,240));
    
    unusedSetsVis.append('rect')
                .attr("class", 'setSizeRect setSize')
                .attr("x", 1)
                .attr("width", (cellSize - 2))
                .attr("style", "stroke:white")
                .attr("style", "fill:darkgray")
                .data(sum_list)
                .attr("y",function (d) {
                    return (textHeight - (setSizeScale(d)));
                })
                .attr("height", function (d) {
                    return setSizeScale(d);
                });
    
    unusedSetsVis.append("rect")
                .attr("class", "setSizeRect Co")
                .attr("x", 1)
                .attr("width", (cellSize - 2))
                .attr("style", "fill:orange")
                .data(co_sum_list)
                .attr("y",function (d) {
                    return (textHeight - (setSizeScale(d)));
                })
                .attr("height", function (d) {
                    return setSizeScale(d);
                });

    var cellDistance = 20;
    var leftOffset = 90;
    var textHeight = 90;
    var textSpacing = 3;

    Remove_nodechildren("unused_name_rec");

    var setRows = unused_headerSVG_tables.selectAll("setRow")
                .data(co_authors);
        setRows.exit().remove();

        setRows.enter()
                .append("g")
                .attr("class", "setRow")
                .attr("transform", function (d, i) {
                    return 'translate(' + (cellDistance * (i )) + ', 0)'
                });
        
        setRows.append('rect')
                .attr("class", 'sortBySet connection vertical')
                .attr("height", (textHeight-2))
                .attr("width", cellDistance)
                .style("opacity", 1)
                .attr("fill", d3.rgb(240,240,240))
                .attr("stroke", "white")
                .attr("transform", function (d, i) {
                        return 'skewX(45) translate(' + (- leftOffset) + ', 0)';
                });

        setRows.append('text')
                .text(function(d){
                    return d['name']
                })
                .attr("font-size", 10)
                .attr("class", 'setLabel')
                .attr("id", function(d){
                    return d;
                })
                .attr("fill", function(d){
                    return Clickable_name_color;
                    // if(has_names.includes(d['name'])){
                    //     console.log(d['name'])
                    //     return Clickable_name_color;
                    // }
                    // else{
                    //     return Unclickable_name_color;
                    // }
                })
                .attr("text-anchor", "end")
                .attr("font-family", "Arial")
                .attr("transform", function (d, i) {
                    return 'translate(0,' + (textHeight - textSpacing - 2) + ')rotate(45)';
                })
                .on("mouseover", function(){
                    d3.select(this)
                        .style("cursor", function(d){
                            return "pointer";
                            if(has_names.includes(d['name'])){
                                return "pointer";
                            }
                        });
                })
                .on("click", function(d){
                    // if(has_names.includes(d['name'])){
                    //     addCoauthor(d['urlname'], d['name']);
                    // }
                    addCoauthor(d['urlname'], d['name']);
                })
                .append("svg:title")
                .text(function (d){
                    return d['name']
                });
}

var histogram_list = new Object();
var select_part = new Object();

var bodySVG_p = d3.select('#bodyVis').select('svg')
            .append("g")
            .attr("class", "logicPanel")
            .attr("id", "logicPanel")
            .attr("transform", "translate(" + 0 + "," + 0 + ")");

var createPatternDefinition = function(patternDefAll, pattern_id){
    var patternDef = patternDefAll.append("pattern")
    .attr({
        id: pattern_id,
        patternContentUnits:"objectBoundingBox",
        x:"0",
        y:"0",
        width:1,
        height:1
    })
    return patternDef;
}

var appendPatternBox = function(patternDef, w, h, color){
    patternDef.append("rect").attr({
        x:(1-w)*0.5,
        y:(1-h)*0.5,
        width:w,
        height:h,
        fill: color
    })
}

var appendPatternRoundedRect = function(patternDef, _x, _y, w, h, r, color){
    patternDef.append("rect").attr({
        rx: w*r,
        ry:h*r,
        x:_x,
        y:_y,
        width:w,
        height:h,
        fill:color
    })
}

var appendPatternCircleCenter = function(patternDef, size, color){
    patternDef.append("circle").attr({
        cx: 0.5,
        cy: 0.5,
        r: size,
        fill: color
    })
}

var appendPatternCircle = function(patternDef, _x, _y, size, color){
    _r = 0.5*size;
    patternDef.append("circle").attr({
        cx:_x+_r,
        cy:_y+_r,
        r: _r,
        fill: color
    })
}

var appendPatternArrow = function(patternDef, color){
    patternDef.append("polyline")
    .style("fill", color)
    .attr("points",".75,.5,.35,.9,.35,.1,.75,.5")

    patternDef.append("polyline")
    .style("fill", "white")
    .attr("points",".55,.5,.35,.7,.35,.3,.55,.5")
}

var appendPatternBackground = function(patternDef, color){
    appendPatternBox(patternDef, 1, 1, color);
}

var appendHorizontalBoxPattern = function(patternDef, color){
    appendPatternBox(patternDef, 0.6, 0.2, color);
}

var appendVerticalBoxPattern = function(patternDef, color){
    appendPatternBox(patternDef, 0.2, 0.6, color);
}

var appendPatternAxes = function(patternDef, color){
    patternDef.append("polyline")
    .style("stroke", color)
    .style("fill", "none")
    .style("stroke-width", "0.05")
    .attr("points",".1,.9,.9,.9")

    patternDef.append("polyline")
    .style("stroke", color)
    .style("fill", "none")
    .style("stroke-width", "0.05")
    .attr("points",".1,.9,.1,.1")
}

var appendPatternLinear = function(patternDef, color){
    patternDef.append("polyline")
    .style("stroke", color)
    .style("fill", "none")
    .style("stroke-width", "0.05")
    .attr("points",".1,.9,.9,.1")
}

var appendPatternSqrt = function(patternDef, color){
    patternDef.append("polyline")
    .style("stroke", color)
    .style("fill", "none")
    .style("stroke-width", "0.05")
    .attr("points",".1,.9,.2,.668,.3,.542,.4,.443,.5,.36,.6,.286,.7,.219,.8,.157,.9,.1")
    //.attr("points",".1,.8,.2,.676,.3,.58,.4,.5,.5,.429,.6,.365,.7,.306,.8,.251,.9,.2,")
}

var appendPatternLog = function(patternDef, color){
    patternDef.append("polyline")
    .style("stroke", color)
    .style("fill", "none")
    .style("stroke-width", "0.05")
    .attr("points",".1,.9,.2,.463,.3,.346,.4,.275,.5,.224,.6,.184,.7,.152,.8,.124,.9,.1")
    //.attr("points",".1,.7,.2,.574,.3,.5,.4,.448,.5,.407,.6,.374,.7,.346,.8,.321,.9,.3")
}

var defineCirclePatterns = function(gQuery, cellSize){
    var patternDefAll = gQuery.selectAll("defs").data([cellSize], function(d){return d;})
    patternDefAll.exit().remove();

    var red = d3.rgb(251,128,114), blue = Clickable_color, gray = d3.rgb(180,180,180);

    patternDefAll = patternDefAll.enter().append("defs");
    var patternDef = createPatternDefinition(patternDefAll, "NotPattern");
    appendPatternBackground(patternDef, red);
    appendHorizontalBoxPattern(patternDef, "white");

    patternDef = createPatternDefinition(patternDefAll, "IgnorePattern");
    appendPatternBackground(patternDef, gray);

    patternDef = createPatternDefinition(patternDefAll, "AndPattern");
    appendPatternBackground(patternDef, blue);
    appendHorizontalBoxPattern(patternDef, "white");
    appendVerticalBoxPattern(patternDef, "white");

    patternDef = createPatternDefinition(patternDefAll, "OrPattern");
    appendPatternBackground(patternDef, blue);
    appendVerticalBoxPattern(patternDef, "white");

    patternDef = createPatternDefinition(patternDefAll, "NotPatternSelected");
    appendPatternBackground(patternDef, "orange");
    appendHorizontalBoxPattern(patternDef, "white");

    patternDef = createPatternDefinition(patternDefAll, "IgnorePatternSelected");
    appendPatternBackground(patternDef, gray);
    appendPatternCircleCenter(patternDef, 0.5, "orange");

    patternDef = createPatternDefinition(patternDefAll, "AndPatternSelected");
    appendPatternBackground(patternDef, "orange");
    appendHorizontalBoxPattern(patternDef, "white");
    appendVerticalBoxPattern(patternDef, "white");

    patternDef = createPatternDefinition(patternDefAll, "OrPatternSelected");
    appendPatternBackground(patternDef, "orange");
    appendVerticalBoxPattern(patternDef, "white");

    patternDef = createPatternDefinition(patternDefAll, "ArrowPattern");
    appendPatternBackground(patternDef, "white");
    appendPatternArrow(patternDef, blue);

    patternDef = createPatternDefinition(patternDefAll, "LinearPattern");
    appendPatternBackground(patternDef, "white");
    appendPatternAxes(patternDef, Clickable_color);
    appendPatternLinear(patternDef, Clickable_color);

    patternDef = createPatternDefinition(patternDefAll, "SqrtPattern");
    appendPatternBackground(patternDef, "white");
    appendPatternAxes(patternDef, Clickable_color);
    appendPatternSqrt(patternDef, Clickable_color);

    patternDef = createPatternDefinition(patternDefAll, "LogPattern");
    appendPatternBackground(patternDef, "white");
    appendPatternAxes(patternDef, Clickable_color);
    appendPatternLog(patternDef, Clickable_color);
    
    patternDef = createPatternDefinition(patternDefAll, "LockPattern");
    appendPatternBackground(patternDef, "white");
    appendPatternCircle(patternDef, 0.33203125, 0.19140625, 0.34765625, Clickable_color);
    appendPatternCircle(patternDef, 0.4140625, 0.26953125, 0.19140625, "white");
    appendPatternBox(patternDef, 0.9, 0.265625, "white");
    appendPatternRoundedRect(patternDef, 0.33203125, 0.359375, 0.078125, 0.11328125, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.6015625, 0.359375, 0.078125, 0.11328125, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.28125, 0.453125, 0.4375, 0.375, 0.15, Clickable_color);

    patternDef = createPatternDefinition(patternDefAll, "UnlockPattern");
    appendPatternBackground(patternDef, "white");
    appendPatternCircle(patternDef, 0.0625, 0.19140625, 0.34765625, Clickable_color);
    appendPatternCircle(patternDef, 0.14453125, 0.26953125, 0.19140625, "white");
    appendPatternBox(patternDef, 0.9, 0.265625, "white");
    appendPatternRoundedRect(patternDef, 0.0625, 0.359375, 0.078125, 0.11328125, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.33203125, 0.359375, 0.078125, 0.11328125, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.28125, 0.453125, 0.4375, 0.375, 0.15, Clickable_color);

    patternDef = createPatternDefinition(patternDefAll, "CompactPattern_unlock");
    appendPatternBackground(patternDef, "white");
    appendPatternRoundedRect(patternDef, 0.0234375, 0.5234375, 0.94921875, 0.05078125, 0.1, gray);
    appendPatternRoundedRect(patternDef, 0.2265625, 0.19921875, 0.1484375, 0.30078125, 0, gray);
    appendPatternRoundedRect(patternDef, 0.42578125, 0.2734375, 0.1484375, 0.2265625, 0, gray);
    appendPatternRoundedRect(patternDef, 0.625, 0.1015625, 0.1484375, 0.3984375, 0, gray);
    appendPatternRoundedRect(patternDef, 0.2265625, 0.6015625, 0.1484375, 0.2265625, 0, gray);
    appendPatternRoundedRect(patternDef, 0.42578125, 0.6015625, 0.1484375, 0.30078125, 0, gray);

    patternDef = createPatternDefinition(patternDefAll, "CompactPattern");
    appendPatternBackground(patternDef, "white");
    appendPatternRoundedRect(patternDef, 0.0234375, 0.5234375, 0.94921875, 0.05078125, 0.1, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.2265625, 0.19921875, 0.1484375, 0.30078125, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.42578125, 0.2734375, 0.1484375, 0.2265625, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.625, 0.1015625, 0.1484375, 0.3984375, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.2265625, 0.6015625, 0.1484375, 0.2265625, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.42578125, 0.6015625, 0.1484375, 0.30078125, 0, Clickable_color);

    patternDef = createPatternDefinition(patternDefAll, "AlignedPattern");
    appendPatternBackground(patternDef, "white");
    appendPatternRoundedRect(patternDef, 0.0234375, 0.5234375, 0.94921875, 0.05078125, 0.1, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.125, 0.19921875, 0.1484375, 0.30078125, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.32421875, 0.2734375, 0.1484375, 0.2265625, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.7265625, 0.1015625, 0.1484375, 0.3984375, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.125, 0.6015625, 0.1484375, 0.2265625, 0, Clickable_color);
    appendPatternRoundedRect(patternDef, 0.52734375, 0.6015625, 0.1484375, 0.30078125, 0, Clickable_color);
};

var getCircleStyleName = function(operator_id, selected){
    if(selected){
        switch(operator_id){
            case 0: return "url(#NotPatternSelected)";
            case 1: return "url(#IgnorePatternSelected)";
            case 2: return "url(#AndPatternSelected)";
            case 3: return "url(#OrPatternSelected)";
        }
    } else {
        switch(operator_id){
            case 0: return "url(#NotPattern)";
            case 1: return "url(#IgnorePattern)";
            case 2: return "url(#AndPattern)";
            case 3: return "url(#OrPattern)";
        }
    }
}

function addLogicPanel(){
    d3.select(document.getElementById("gRows"))
    .attr("transform", "translate(90,140)");

    var text_info;

    var cellDistance = 20;
    var dataset = new Array();
    dataset = [1,2,3,4];

    var select = new Array(author_list.length), au_num = author_list.length;
    while(au_num--){select[au_num] = 2;}

    //defineCirclePatterns(bodySVG_p, 16);    

    var fakeGroup = bodySVG_p.append("g")
                            .attr("id", "fakeGoup");
        fakeGroup.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 531)
                .attr("height", 20)
                .attr("class", "groupbackground")
                .attr("fill", "lightgray");
        
        fakeGroup.append("text")
                .attr("x", 12)
                .attr("y", 15)
                .attr("font-family", "Arial")
                .attr("font-size", 14) 
                .attr("class", "grouplabel")
                .text("Add Paper Set");
        
        fakeGroup.append("text")
                .attr("id", "logicPanelAddtext")
                .attr("transform", "translate(223,16)")
                .text("+")
                .attr("font-family", "Arial")
                .attr("font-size", 20)
                .style("fill", Clickable_color)
                .on("mouseover", function(){
                    d3.select(this)
                        .style("cursor", "pointer")
                        .style("fill", "orange");
                    add_hints("addpaperset");
                })
                .on("mouseout", function(){
                    d3.select(this)
                        .style("fill", Clickable_color);
                    remove_hints();
                })
                .on("click", function(){
                    addGraph(NUM_GRAPHS, select);
                    remove_hints();
                    histogram_list[NUM_GRAPHS] = new Object();
                    histogram_list[NUM_GRAPHS]['select_circles'] = select;
                    histogram_list[NUM_GRAPHS]['text_info'] = text_info; 
                    histogram_list[NUM_GRAPHS]['color'] = Clickable_color;
                    NUM_GRAPHS += 1;
                    d3.select("#logic_panel_rec").style("fill", "url(#AndPattern)");
                    ADD_panel_num += 1;
                    removeLogicPanel();
                });
    
    var logicpanelrows = bodySVG_p.append("g")
                                .attr("id", "logicPanelRow")
                                .attr("transform", "translate(0,20)")
                                .attr("height", 105)
                                .style("opacity", 1);

        logicpanelrows.append("rect")
                    .attr("class", "logicPanelRect")
                    .attr("width", 530)
                    .attr("height", 105)
                    .style("fill", "none")
                    .style("stroke", "lightgray");
    
    var logicpanelSelectHeader = logicpanelrows.append("g")
                                            .attr("class", "logicPanelSelectionHeader")
                                            .attr("transform", "translate(90,0)");
    
    logicpanelSelectHeader.selectAll("logicheadercircles")
                        .data(author_list)
                        .enter()
                        .append("circle")
                        .attr("id", function(d, i){
                            return "logicPanelHeaderCircle_" + i;
                        })
                        .attr("cx", function(d, i){
                            return 10 + 20 * i;
                        })
                        .attr("cy", 10)
                        .attr("r", 7)
                        .style("fill", Unclickable_name_color);
    
    var logicpanelSelectTable = logicpanelrows.append("g")
                                            .attr("class", "logicPanelSelectionTable");
    
    logicpanelSelectTable.append("rect")
                        .attr("transform", "translate(90,25)")
                        .attr("x", 0)
                        .attr("y", -3)
                        .attr("width", 120)
                        .attr("height", 1)
                        .style("fill", Unclickable_name_color);
    
    var tables = logicpanelSelectTable.selectAll("logicTableRow")
                    .data(dataset)
                    .enter()
                    .append("g")
                    .attr("class", "logicTableRow")
                    .attr("transform", function (d, i) {
                        return 'translate(90,' + (5 + cellDistance * (i + 1)) + ')'
                    });
    
        tables.append("text")
            .text(function(d, i){
                if(i == 0){
                    return "Not"
                }
                else if (i == 1){
                    return "Ignore"
                }
                else if(i == 2){
                    return "And"
                }
                else{
                    return "Or" 
                }
            })
            .attr("x", -4)
            .attr("y", 15)
            .attr("fill", Unclickable_name_color)
            .style("text-anchor", "end")
            .attr("font-family", "Arial")
            .attr("font-size", 12);
        
        tables.each(function(row, j){
            var style_fill=getCircleStyleName(j, (j==1));
            d3.select(this).selectAll("logicPanelCircle")
            .data(author_list)
            .enter()
            .append("circle")
            .attr("id", function(d, i){
                return "logicPanelCircle_" + j + i;
            })
            .attr("cx", function(d, i){
                return 10 + cellDistance * (i);
            })
            .attr("cy", 10)
            .attr("r", 8)
            .style("fill", style_fill)
            .on("mouseover", function(){
                d3.select(this).style("cursor", "pointer");
            })
            .on("click",function(){
                var index = $("circle").index(this)-5;
                var m = parseInt(index/author_list.length);
                var k = index%author_list.length;

                console.log("index", index)
                console.log("m", m)
                console.log("k", k)
                
                d3.select(this).style("fill", getCircleStyleName(m-1, true))
                if(select[k] != m){
                    d3.select(document.getElementById("logicPanelCircle_" + (select[k]-1) +k))
                    .style("fill", getCircleStyleName(select[k]-1, false));

                    d3.select(document.getElementById("logicPanelHeaderCircle_" + k))
                    .style("fill", getCircleStyleName(m-1, false));
                }
                console.log("select    : " + select)
                console.log("events     :" + select_events)
                console.log("full      : " + full_names)
                select[k] = m;
                var or_list = "", must_list="", not_list="";
                var or_venue_list = "", must_venue_list = "", not_venue_list = "";
                for(var i=0; i<select.length; ++i){
                    if(select_events[i] == 0){
                        if(select[i]==4){
                            if(or_list.length!=0){
                                or_list += " OR ";
                            }
                            or_list += author_list[i];
                        }
                        if(select[i]==3){
                            if (must_list.length!=0) {
                                must_list += " AND ";
                            }
                            must_list += author_list[i];
                        } else if (select[i]==1){
                            if (not_list.length!=0) {
                                not_list += " OR ";
                            }
                            not_list += author_list[i];
                        }
                    }
                    else{
                        if(select[i]==4){
                            if(or_venue_list.length!=0){
                                or_venue_list += " OR ";
                            }
                            or_venue_list += author_list[i];
                        }
                        if(select[i]==3){
                            if (must_venue_list.length!=0) {
                                must_venue_list += " AND ";
                            }
                            must_venue_list += author_list[i];
                        } else if (select[i]==1){
                            if (not_venue_list.length!=0) {
                                not_venue_list += " OR ";
                            }
                            not_venue_list += author_list[i];
                        }
                    }
                }

                if (or_list.length!=0 || must_list.length!=0 || or_venue_list.length!=0 || must_venue_list.length!=0){
                    ret = "Papers";
                    if (or_list.length!=0 && must_list.length!=0) {
                        if(or_list.length > 1){
                            ret += " authored by ("+or_list + ") AND " + must_list;                        
                        }
                        else{
                            ret += " authored by "+or_list + " AND " + must_list;                        
                        }
                    }
                    else if(or_list.length!=0 && must_list.length==0){
                        ret += " authored by "+or_list;
                    }
                    else if(or_list.length==0 && must_list.length!=0){
                        ret += " authored by "+must_list;
                    }
                    if (not_list){
                        if(or_list.length==0 && must_list.length==0){
                            ret += " NOT authored by "+not_list;
                        }
                        else{
                            ret += " but NOT "+not_list;
                        }
                    } 
                    if (or_venue_list.length!=0 && must_venue_list.length!=0) {
                        ret += " published on "+or_venue_list + " AND " + must_venue_list;                        
                    }
                    else if(or_venue_list.length!=0 && must_venue_list.length==0){
                        ret += " published on "+or_venue_list;
                    }
                    else if(or_venue_list.length==0 && must_venue_list.length!=0){
                        ret += " published on "+must_venue_list;
                    }
                    if (not_venue_list){
                        if(or_venue_list.length==0 && must_venue_list.length==0){
                            ret += " NOT published on "+not_venue_list;
                        }
                        else{
                            ret += " but NOT "+not_venue_list;
                        }
                    }
                    ret += ".";    
                }
                text_info = ret; 
                console.log("info     : " + ret)

                var split_ret = ret.split(" ")

                var one_line_word = 50;
                if(select_events.length > 6){
                    one_line_word = 50 - 8*(select_events.length - 6);
                }
                var new_ret = "";
                for(var j = 0; j < split_ret.length; j++){
                    if(parseInt((new_ret.length + split_ret[j].length +1)/one_line_word) != parseInt(new_ret.length/one_line_word)){
                        new_ret += ',';
                    }
                    new_ret += split_ret[j] + ' ';
                }

                console.log("new_ret: " + new_ret)

                rets = new_ret.split(",");

                Remove_nodechildren("logicPanelActualText addButton");

                logicPanelActualText.selectAll("tspan")
                                .data(rets)
                                .enter()
                                .append("tspan")
                                .attr("x", 0)
                                .attr("dy", 15)
                                .style("fill", Unclickable_name_color)
                                .text(function(d){return d;})

                // d3.select(document.getElementById("logicPanelActualText addButton"))
                //     .text(function(){
                //         var or_list = "", must_list="", not_list="";
                //         for(var i=0; i<select.length; ++i){
                //             if(select[i]==4){
                //                 if(or_list.length!=0){
                //                     or_list += " OR ";
                //                 }
                //                 or_list += author_list[i];
                //             }
                //             if(select[i]==3){
                //                 if (must_list.length!=0) {
                //                     must_list += " AND ";
                //                 }
                //                 must_list += author_list[i];
                //             } else if (select[i]==1){
                //                 if (not_list.length!=0) {
                //                     not_list += " OR ";
                //                 }
                //                 not_list += author_list[i];
                //             }
                //         }
                //         var ret = "No paper selected.";
                //         if (or_list.length!=0 || must_list.length!=0){
                //             if (or_list.length!=0 && must_list.length!=0) {
                //                 ret = "Papers authored by "+or_list + " AND " + must_list;                        
                //             }
                //             else if(or_list.length!=0 && must_list.length==0){
                //                 ret = "Papers authored by "+or_list;
                //             }
                //             else if(or_list.length==0 && must_list.length!=0){
                //                 ret = "Papers authored by "+must_list;
                //             }
                //             if (not_list){
                //                 ret += " but NOT "+not_list;
                //             }
                //             ret += ".";    
                //         }
                //         text_info = ret; 
                //         return ret;
                //     })
            });
        });
    var ret = "No paper selected.";
    var rets = ret.split(",")
    var logicPanelActualText = logicpanelrows.append("text")
                                .attr("id", "logicPanelActualText addButton")
                                .attr("transform", function(){
                                    if(select_events.length > 6){
                                        return "translate(" + (215+20*(select_events.length-6)) + ",-15)";
                                    }
                                    else{
                                        return "translate(215,-15)";
                                    }
                                })
                                .attr("y", 20)
                                .attr("dy", 1)
                                .attr("font-family", "Arial")
                                .style("font-size", 12)
                                .style("text-anchor", "start")
                                .style("dominant-baseline", "auto")
                                .text(" ");
        
        logicPanelActualText.selectAll("tspan")
                                .data(rets)
                                .enter()
                                .append("tspan")
                                .attr("x", 0)
                                .attr("dy", 15)
                                .style("fill", Unclickable_name_color)
                                .text(function(d){return d;})
}

function removeLogicPanel(){
    d3.select(document.getElementById("gRows"))
    .attr("transform", "translate(90,0)");

    var parent = document.getElementById("logicPanel");
    var childrens = parent.childNodes;
    if(childrens != ''){
        for(var i = childrens.length - 1; i >= 0; i--)
        {
        parent.removeChild(childrens[i]);
        }
    }
}

function removeGraph(uid)
{
    console.log("remove scholar", uid);
    Remove_nodechildren("gRows");
    // var nodes = document.getElementById("graph" + uid),
    // parent = nodes.parentElement;
    // parent.removeChild(nodes);
    delete histogram_list[uid];

    if(Object.getOwnPropertyNames(histogram_list).length > 4){
        d3.select("#cicless").style("height", function(){return Object.getOwnPropertyNames(histogram_list).length *100;});
    }
    else{
        d3.select("#cicless").style("height", 440);
    }

    for(var turn in Show_Sunbursts_all){
        if(Show_Sunbursts_all[turn]['left_index'] == uid){
            if(turn == 'up'){updraw = 0;}
            else{downdraw =0;}
            delete Show_Sunbursts_all[turn];
            removeSunburst(turn, 1);
        }
    }

    minimum_year = 5000;
    maximum_year = 0;
    hist_y_max = 0;

    for(var id in histogram_list){
        var new_year_list = Object.keys(histogram_list[id]['histogram_info']);
        if(new_year_list[0] < minimum_year){
            minimum_year = new_year_list[0];
        }
        if(new_year_list[new_year_list.length - 1] > maximum_year){
            maximum_year = new_year_list[new_year_list.length - 1];
        }
    }
    var year_list = new Array();
    for(var i = minimum_year; i <= maximum_year; i++){
        year_list.push(i);
    }

    for(var id in histogram_list){
        var dataset = histogram_list[id]['histogram_info'];
        for(var i = minimum_year; i <= maximum_year; i++){
            if(dataset[i]){
                if(dataset[i].length > hist_y_max){
                    hist_y_max = dataset[i].length;
                }
            }
        }
    }

    //defineCirclePatterns(bodySVG_g, 16);
    for(var id in histogram_list){
        redraw_Graph(id, year_list);
    }
}

var bodySVG_g = d3.select('#bodyVis').select('svg')
                .append("g")
                .attr("class", "gRows")
                .attr("id", "gRows")
                .attr("transform", "translate(" + 90 + "," + 0 + ")");

function addGraph(uid, select){
    var aOrSelect = new Array();
    var aSelect = new Array();
    var aUnselect = new Array();
    var vSelect = new Array();
    var vUnselect = new Array();
    var au_num = Object.getOwnPropertyNames(author_list_all).length;
    for(var index in select){
        if(select_events[index] == 0){
            if(select[index] == 3){
                aSelect.push(author_list[index]);
            }
            else if(select[index] == 1){
                aUnselect.push(author_list[index]);
            }
            else if(select[index] == 4){
                aOrSelect.push(author_list[index]);
            }
        }
        else{
            if(select[index] == 3){
                vSelect.push(full_names[index]);
            }
            else if(select[index] == 1){
                vUnselect.push(full_names[index]);
            }
            else if(select[index] == 4){
                vSelect.push(full_names[index]);
            }
        }
    }

    console.log(vSelect);
    console.log(vUnselect);

    var number = 3;
    if(aSelect.length != 0 || aOrSelect.length != 0 || vSelect.length != 0){
        (function() {
            //var test = "http://98.220.5.15:1234/user";
            var test = "http://140.82.48.134:1234/user";
            $.getJSON( test, {
                num : number,
                orselect: JSON.stringify(aOrSelect),
                select: JSON.stringify(aSelect),
                unselect: JSON.stringify(aUnselect),
                v_select: JSON.stringify(vSelect),
                v_unselect: JSON.stringify(vUnselect)
            })
              .done(function( data ) {
                  if(data['num'] == '0'){
                    histogram_list[uid]['histogram_info'] = data['paper_info'];
                    var this_year_scale = Object.keys(data['paper_info']);
                    select_part[uid] = []
                    select_part[uid][0] = this_year_scale[0];
                    select_part[uid][1] = this_year_scale[this_year_scale.length - 1];
                    update_scale(data['paper_info']);
                  }
                  else{
                    delete histogram_list[NUM_GRAPHS-1]
                    NUM_GRAPHS -= 1
                    alert("No papers! ");
                  }
              });
        })(); 
    }
    else{
        alert("Error !");
        //removeGraph(uid);
    }
}

var minimum_year = 5000;
var maximum_year = 0;
var hist_y_max = 0;
function update_scale(dataset){
    var new_year_list = Object.keys(dataset);
    if(new_year_list[0] < minimum_year){
        minimum_year = new_year_list[0];
    }
    if(new_year_list[new_year_list.length - 1] > maximum_year){
        maximum_year = new_year_list[new_year_list.length - 1];
    }
    var year_list = new Array();
    for(var i = minimum_year; i <= maximum_year; i++){
        year_list.push(i);
        if(dataset[i]){
            if(dataset[i].length > hist_y_max){
                hist_y_max = dataset[i].length;
            }
        }
    }
    
    Remove_nodechildren("gRows");
    if(Object.getOwnPropertyNames(histogram_list).length > 4){
        d3.select("#cicless").style("height", function(){return Object.getOwnPropertyNames(histogram_list).length *100;});
    }
    else{
        d3.select("#cicless").style("height", 440);
    }

    //defineCirclePatterns(bodySVG_g, 16);
    for(var id in histogram_list){
        redraw_Graph(id, year_list);
    }
}

function redraw_Graph(uid, new_year_list){
    var select = histogram_list[uid]['select_circles'];

    var Graph = bodySVG_g.append("g")
                        .attr("id", function(){
                            return "graph" + uid;
                        })
                        .style("opacity", 1);
    
    Graph.append("rect")
        .attr("class", "graph_rect")
        .attr("rx", 5)
        .attr("ry", 10)
        .attr("width", 530)
        .attr("height", 1)
        .attr("x", -90)
        .attr("y", 2)
        .style("fill", "darkgray");

    var circles = Graph.append("g")
                        .attr("class", "combination")
                        .attr("transform", "translate(0,5)");
        
        circles.selectAll("cell")
                .data(author_list)
                .enter()
                .append("circle")
                .attr("cx", function(d, i){
                    return 10 + 20*i;
                })
                .attr("cy", 10)
                .attr("r", 8)
                .style("fill", function(d,i){
                    if(i >= select.length){
                        return "url(#IgnorePattern)";
                    }
                    else{
                        return getCircleStyleName(select[i]-1, false);
                    }
                })
                .on("mouseover", function(){
                    add_paperset_hints(histogram_list[uid]['text_info']);
                })
                .on("mouseout", function(){
                    remove_hints();
                });
    
    Graph.append("g")
        .attr("id", function(){
            return "g" + uid;
        })
        .attr("transform", function(){
            if(select_events.length < 4){
                return "translate(60,5)";
            }
            else{
                return "translate(" + (60+20*(select_events.length-3)) + ",5)";
            }
        });
    
    drawHist(uid, new_year_list);
    
    var parents = document.getElementById("gRows");
    var childrens = parents.childNodes;
    for(var i = childrens.length-1; i >=0; i--){
        d3.select(childrens[i])
        .attr("transform", function(){
            return "translate(0," + i * 100 + ")";
        })
    }

    Graph.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", -90)
        .attr("y", 70)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "url(#NotPattern)")//"rgb(161,217,155)")
        .style("opacity", 0.5)
        .style("cursor", "pointer")
        .on("mouseover", function(){
            d3.select(this)
                .style("opacity", 1);
            add_hints("removepaperset");
        })
        .on("mouseout", function(){
            d3.select(this)
                .transition()
                .duration(100)
                .style("opacity", 0.5);
            remove_hints();
        })
        .on("click", function(){
            removeGraph(uid);
            remove_hints();
        });
}

// function drawHist(uid, new_year_list)
// {
//     console.log("draw "+uid);
    
//     var select_show_details = new Array();

//     var dataset = histogram_list[uid]['histogram_info'];
//     var width = 1./3. * c_width - 60;
//     //###############
//     var height = 1./4. * c_height;
//     var rectWidth = 11;
    
//     if(new_year_list.length > 15){
//         rectWidth = width / (2 * new_year_list.length + 4);
//     }
//     //画布周边的空白
//     var padding = {left:5, right:0, top:5, bottom:5};

//     var svg = d3.select('#g' + uid).append('svg').attr('width',width).attr('height',height)
//                 .attr("transform", "translate(30,0)");
                
//     var xScale = d3.scale.ordinal()
//             .domain(d3.range(0,new_year_list.length))
//             //.range([0,width-padding.left-padding.right]);
//             .rangeRoundBands([0, new_year_list.length * (rectWidth * 2 )]);

//     // var y_max = d3.max(new_year_list, function(d){
//     //     if(dataset[d]){
//     //         return dataset[d].length;
//     //     }
//     //     else{
//     //         return 0;
//     //     }
//     // })
//     var y_max = hist_y_max;
//     var yScale = d3.scale.linear()
//             //.domain([0,d3.max(dataset) + 5])
//             .domain([0, y_max + 5])
//             .range([height-padding.bottom-padding.top,5]);

//     var rects = svg.selectAll('MyRect')
//             .data(new_year_list)
//             .enter()
//             .append('rect')
//             .attr('class','MyRect')
//             .attr("transform","translate(" + padding.left + "," + padding.top + ")")
//             .attr('x',function(d,i){
//                 return xScale(i) + rectWidth/2 + 15;
//             }).attr('y',function(d,i){
//                 if(dataset[d]){
//                     return (yScale(dataset[d].length) - 15);
//                 }
//                 return (yScale(0) - 15);
//             })
//             .attr('width',xScale.rangeBand() - rectWidth)
//             .attr('height',function(d,i){
//                 if(dataset[d]){
//                     return height-padding.bottom-padding.top-yScale(dataset[d].length);
//                 }
//                 return height-padding.bottom-padding.top-yScale(0);
//             })
//             .attr('fill','steelblue')
//             // .on("mouseover", function(d,i){
//             //     d3.select(this)
//             //         .attr("fill", "orange");
//             //     texts.attr('fill-opacity', 1);
//             // })
//             // .on("mouseout", function(d,i){
//             //     d3.select(this)
//             //         .transition()
//             //         .duration(100)
//             //         .attr("fill", "steelblue");
//             //     texts.transition()
//             //         .duration(100)
//             //         .attr("fill-opacity", 0);
//             // })
//             .on("click", function(d,i){
//                 d3.select(this)
//                 .attr("fill", "orange");
//                 select_show_details.push(d);
//                 if(select_show_details.length == 2){
//                     if(select_show_details[0] > select_show_details[1]){
//                         var m = select_show_details[1];
//                         select_show_details[1] = select_show_details[0];
//                         select_show_details[0] = m;
//                     }
//                     d3.select("#g" + uid).selectAll("rect.MyRect")
//                         .attr("fill", function(d){
//                             if(d>= select_show_details[0] & d<= select_show_details[1]){
//                                 return "orange";
//                             }
//                             else{
//                                 return "steelblue";
//                             }
//                         });
                    
//                     var start_year = xScale(select_show_details[1]-minimum_year)/2;
//                     var end_year = xScale(select_show_details[0]-minimum_year)/2;
//                     var show_details_scale = svg.append("rect")
//                                             .attr("class", "show_details_rect")
//                                             .attr("x", function(){
//                                                 return start_year + end_year + rectWidth/2 + 7;
//                                             })
//                                             .attr("y", y_max)
//                                             //.attr("fill", "lightgray")
//                                             .attr("width", 60)
//                                             .attr("height", 20)
//                                             .attr("rx", 5)
//                                             .attr("ry", 5)
//                                             .style("fill", "steelblue")//"rgb(161,217,155)")
//                                             .style("opacity", 0.5)
//                                             .style("cursor", "pointer")
//                                             .on("mouseover", function(){
//                                                 d3.select(this)
//                                                     .style("opacity", 1);
//                                             })
//                                             .on("mouseout", function(){
//                                                 d3.select(this)
//                                                     .transition()
//                                                     .duration(100)
//                                                     .style("opacity", 0.5);
//                                             })
//                                             .on("click", function(){
//                                                 Show_details(uid, select_show_details);
//                                                 select_show_details = [];
//                                             });

//                             svg.append("text")
//                                 .attr("class", "selection-button")
//                                 .attr("transform", function(){
//                                     return "translate(" + (start_year + end_year + rectWidth) + "," + (y_max+12) + ")"; 
//                                 })
//                                 .attr("pointer-events", "none")
//                                 .style("font-family", "FontAwesome")
//                                 .style("font-size", 10)
//                                 .text("Show Details");
//                 }
//             });

//     var texts = svg.selectAll('MyText')
//             .data(new_year_list)
//             .enter()
//             .append('text')
//             .attr('class','MyText')
//             .attr("transform","translate(" + padding.left + "," + (padding.top - 10) + ")")
//             .attr('x',function(d,i){
//                 return xScale(i) + rectWidth + 8;
//             }).attr('y',function(d,i){
//                 if(dataset[d]){
//                     return yScale(dataset[d].length)-5;
//                 }
//                 return yScale(0)-5;
//             })
//             .attr("font-size", 15)
//             .attr("fill", "orange")
//             .attr("fill-opacity", 0)
//             .text(function(d){
//                 if(dataset[d]){
//                     if(dataset[d].length == 0)
//                     {return ;}
//                     return dataset[d].length;
//                 }
//                 return ;
//             });
    
//     var xAxis = d3.svg.axis()
//     .scale(xScale)
//     .orient("bottom");                
//     //定义y轴
//     var yAxis = d3.svg.axis()
//             .scale(yScale)
//             .orient("left");

//     svg.append('g')
//             .attr('class','axis')
//             .attr("transform","translate(" + (padding.left + 15) + "," + (height - padding.bottom - 15) + ")")
//             .call(xAxis)
//             .selectAll("text")
//             .data(new_year_list)
//             .text(function(d){
//                 return d;
//             })
//             .attr("font-size", function(){
//                 if(rectWidth == 11){
//                     return 8;
//                 }
//                 else{
//                     return 4;
//                 }
//             });

//     svg.append('g')
//             .attr('class','axis')
//             .attr("transform","translate(" + (padding.left + 15) + "," + (padding.top-15) + ")")
//             .call(yAxis);
// }

function drawHist(uid, new_year_list){
    var select_show_details = new Array();
    select_show_details[0] = new_year_list[0];
    select_show_details[1] = new_year_list[new_year_list.length-1];

    var dataset = histogram_list[uid]['histogram_info'];
    var width = 370;
    
    //###############
    var height = 100;
    var rectWidth = 11;

    if(select_events.length > 3){
        width = 370 - 20 * (select_events.length-3);
        rectWidth = width / 34;
    }
    
    if(new_year_list.length > 15){
        rectWidth = width / (2 * new_year_list.length + 4);
    }
    //画布周边的空白
    var padding = {left:10, right:0, top:5, bottom:5};

    var svg = d3.select('#g' + uid).append('svg').attr('width',width).attr('height',height)
                .attr("transform", "translate(30,0)");
                
    var xScale = d3.scale.ordinal()
            .domain(d3.range(0,new_year_list.length))
            //.range([0,width-padding.left-padding.right]);
            .rangeRoundBands([0, new_year_list.length * (rectWidth * 2 )]);

    // var y_max = d3.max(new_year_list, function(d){
    //     if(dataset[d]){
    //         return dataset[d].length;
    //     }
    //     else{
    //         return 0;
    //     }
    // })
    var y_max = hist_y_max;
    var yScale = d3.scale.linear()
            //.domain([0,d3.max(dataset) + 5])
            .domain([0, y_max + 2])
            .range([height-padding.bottom-padding.top,7]);

    var rects = svg.selectAll('MyRect')
            .data(new_year_list)
            .enter()
            .append('rect')
            .attr('class','MyRect')
            .attr('id', 'MyRect')
            .attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .attr('x',function(d,i){
                return xScale(i) + rectWidth/2 + 15;
            }).attr('y',function(d,i){
                if(dataset[d]){
                    return (yScale(dataset[d].length) - 15);
                }
                return (yScale(0) - 15);
            })
            .attr('width',xScale.rangeBand() - rectWidth)
            .attr('height',function(d,i){
                if(dataset[d]){
                    return height-padding.bottom-padding.top-yScale(dataset[d].length);
                }
                return height-padding.bottom-padding.top-yScale(0);
            })
            .attr('fill', function(d){
                if( d >= select_part[uid][0] && d <= select_part[uid][1]){
                    return histogram_list[uid]['color'];
                }
                else{
                    return 'lightgray';
                }
            });
            
    var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");                
    //定义y轴
    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

    svg.append('g')
            .attr('class','axis')
            .attr("transform","translate(" + (padding.left + 15) + "," + (height - padding.bottom - 15) + ")")
            .call(xAxis)
            .selectAll("text")
            .data(new_year_list)
            .text(function(d){
                if(d%5 == 0.0){
                    return d;
                }
                else{
                    return '';
                }
            })
            .attr("font-family", "Arial")
            .attr("fill", Unclickable_name_color)
            .attr("font-size", function(){
                if(rectWidth == 11){
                    return 10;
                }
                else{
                    return 10;
                }
            });

    svg.append('g')
            .attr('class','axis')
            .attr("transform","translate(" + (padding.left + 15) + "," + (padding.top-15) + ")")
            .call(yAxis)
            .selectAll("text")
            .text(function(d){
                var num = 5;
                if(y_max <= 3){
                    num = 3;
                }
                if(d%num == 0.0){
                    return d;
                }
                else{
                    return '';
                }
            })
            .attr("font-family", "Arial")
            .attr("fill", Unclickable_name_color)
            .attr("font-size", "10px");

    var brush = d3.svg.brush().x(xScale).extent(new_year_list);

    var gBrush = svg.append("g").attr("class", "brush").call(brush)
                    .attr("transform",function(){
                        return "translate(23," + (yScale(y_max) - 15) + ")";
                    });
            gBrush.selectAll("rect").attr("height", height - yScale(y_max));
            gBrush.selectAll(".resize").append("path").attr("d", resizePath);

    function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 7;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
        }

    brush.on("brushstart.chart", function(){
        d3.select("#g" + uid).select('svg').selectAll("#MyRect")
        .attr("fill", "lightgray");
    });

    brush.on("brush.chart", function(){
        var extent = brush.extent();
        extent[0] = extent[0] + 12;
        extent[1] = extent[1] + 12;
        var svg = document.getElementById("g"+uid).childNodes[0],
            nodes = svg.childNodes;
        for(var i = 0; i<nodes.length; i++){
            if(nodes[i].tagName == 'rect'){
                    if((nodes[i].x.animVal.value >= extent[0]) && (nodes[i].x.animVal.value < extent[1])){
                        d3.select(nodes[i]).attr("fill", histogram_list[uid]['color']);
                    }
                    else{
                        d3.select(nodes[i]).attr("fill", "lightgray");
                    }
            }
        }
    });

    brush.on("brushend.chart", function() {
        var extent = brush.extent();
        extent[0] = extent[0] + 12;
        extent[1] = extent[1] + 12;
        if(extent[0] == extent[1]){
            brush.extent([0, new_year_list.length * (rectWidth * 2 )-12]);
            gBrush.call(brush);
            extent = brush.extent();
            extent[0] = extent[0] + 12;
            extent[1] = extent[1] + 12;
        }
        var svg = document.getElementById("g"+uid).childNodes[0],
            nodes = svg.childNodes,
            x_s = new Array();
            x_s.push(0)
        for(var i = 0; i<nodes.length; i++){
            if(nodes[i].tagName == 'rect'){
                    x_s.push(nodes[i].x.animVal.value);
                    if((nodes[i].x.animVal.value >= extent[0]) && (nodes[i].x.animVal.value < extent[1])){
                        d3.select(nodes[i]).attr("fill", histogram_list[uid]['color']);
                    }
                    else{
                        d3.select(nodes[i]).attr("fill", "lightgray");
                    }
            }
        }
        x_s.push((x_s[x_s.length-1]+2*rectWidth))
        for(var i = 0; i < x_s.length-1; i ++){
            if((extent[0] > x_s[i]) && (extent[0] < x_s[i+1])){
                select_show_details[0] = new_year_list[i];
            }
            if(extent[0] == x_s[i]){
                select_show_details[0] = new_year_list[i];
            }
            if((extent[1] > x_s[i]) && (extent[1] <= x_s[i+1])){
                select_show_details[1] = new_year_list[i-1];
            }
        }
        console.log(x_s)
        console.log(extent)
        console.log(select_show_details)
        console.log(uid)
        select_part[uid] = select_show_details;
    });

    var show = svg.append("g").attr("class", "show_details_choice")
                .attr("id", "show_details_choice")
                .attr("transform", function(){
                    return "translate(" + width + "," + height/2 + ")";
                });
            show.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("x", -15)
                .attr("y", -20)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", "url(#ArrowPattern)")//"rgb(161,217,155)")
                .style("opacity", 0.5)
                .style("cursor", "pointer")
                .on("mouseover", function(){
                    d3.select(this)
                        .style("opacity", 1);
                    add_hints("torightpart");
                })
                .on("mouseout", function(){
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .style("opacity", 0.5);
                    remove_hints();
                })
                .on("click", function(){
                    remove_hints();
                    Show_details(uid, select_show_details);
                });

            // show.append("text")
            //     .text(">")
            //     .attr("x", -8)
            //     .attr("y", 12)
            //     .attr("font-size", "10")
            //     .attr("font-face", "Courier New bold");
}

var Show_Sunbursts_all = new Object();

var SUNLOCK = 1;
function Show_details(uid, select_show_details){
    if(updraw == 0 || downdraw == 0){
        var turn = 'up';
        if(updraw != 0){
            turn = 'down';
        }
        var show_details_list = new Array();
        show_details_list = [];
        console.log(select_show_details)
        histogram_list[uid]['color'] = up_down_colorlist[turn];

        var year_list = new Array();
        for(var i = minimum_year; i <= maximum_year; i++){
            year_list.push(i);
        }
        
        Remove_nodechildren("gRows");

        //defineCirclePatterns(bodySVG_g, 16);
        for(var id in histogram_list){
            redraw_Graph(id, year_list);
        }

        for(var i in histogram_list[uid]['histogram_info']){
            if(i>= select_show_details[0] & i <= select_show_details[1]){
                for(var j in histogram_list[uid]['histogram_info'][i])
                    show_details_list.push(histogram_list[uid]['histogram_info'][i][j])
            }
        }
        console.log(show_details_list)
        Show_Sunbursts_all[turn] = new Object();
        Show_Sunbursts_all[turn]['title_text_info'] = histogram_list[uid]['text_info'];
        Show_Sunbursts_all[turn]['paper_list'] = show_details_list;
        Show_Sunbursts_all[turn]['show_property'] = "# Citations";
        Show_Sunbursts_all[turn]['show_group_by'] = ["Individual Paper", "P. Venue Type", "P. Year"];
        Show_Sunbursts_all[turn]['group_lists'] = new Object();
        Show_Sunbursts_all[turn]['left_index'] = uid;
        if(SUNLOCK == 1){
            if(updraw == 0 && downdraw == 1){
                Show_Sunbursts_all['up']['show_property'] = Show_Sunbursts_all['down']['show_property'].slice();
                Show_Sunbursts_all['up']['show_group_by'] = Show_Sunbursts_all['down']['show_group_by'].slice();
            }
            else if(downdraw == 0 && updraw == 1){
                Show_Sunbursts_all['down']['show_property'] = Show_Sunbursts_all['up']['show_property'].slice();
                Show_Sunbursts_all['down']['show_group_by'] = Show_Sunbursts_all['up']['show_group_by'].slice();
            }
        }
        
        var number = 5;
        (function() {
            var test = "http://140.82.48.134:1234/user";
            $.getJSON( test, {
                num : number,
                list: JSON.stringify(show_details_list),
                property: Show_Sunbursts_all[turn]['show_property'],
                group_by: JSON.stringify(Show_Sunbursts_all[turn]['show_group_by']),
                group_lists: JSON.stringify(Show_Sunbursts_all[turn]['group_lists'])
            })
            .done(function( data ) {
                if(data['num'] == '0'){
                    align_num = 0;
                    console.log(JSON.stringify(data['tree']))
                    drawSun(turn, data['tree']);
                }
            });
        })(); 
    }
    else{
        alert("Please remove one Sunburst first!");
    }
}

function draw_down_second_change(data, num){

    var down_second_choice = d3.select("#down_logo").append("g")
                            .attr("id", "down_second_choice")
                            .attr("transform", "translate(0,0)");

    down_second_choice.append("rect")
        .attr("width", 120)
        .attr("height", 175)
        .attr("x", -120)
        .attr("y", function(){
            return data.y-10;
        })
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "white")
        .style("stroke", Clickable_name_color)
        .style("opacity", 0.9)
        .on("mouseout", function(){
            var element = document.getElementById("down_second_choice");
            var el = window.document.body;
            var judge = 0;
            window.document.body.onmouseover = function(event){
            el = event.target;
            for(var i = 0; i < element.childNodes.length; i ++){
                if(el == element.childNodes[i]){
                    judge = 1;
                }
            }
            if(judge == 0 && element.parentNode != null){
                element.parentNode.removeChild(element);

                d3.selectAll(".group_by")
                .style("fill", Clickable_name_color);
            }
            }  
        });
    
    var second_title = ["Change", "|", "Group", "|", "Delete"];
    down_second_choice.selectAll(".second_title_text")
        .data(second_title)
        .enter().append("text")
        .attr("x", function(d,i){
            if(i == 0){
                return -115;
            }
            else if(i == 1){
                return -75;
            }
            else if(i == 2){
                return -69;
            }
            else if(i == 3){
                return -39;
            }
            else if(i == 4){
                return -33;
            }
        })
        .attr("y", function(){
            return data.y;
        })
        .text(function(d){
            return d;
        })
        .style("fill", function(d){
            if(d == "Change"){
                return "orange";
            }
            else{
                return "black";
            }
        })
        .style("font-size", 10)
        .style("font-family", "Arial")
        .on("mouseover", function(d){
            if(d != "|"){
                d3.select(this)
                .style("fill", "orange")
                .style("cursor", "pointer");
            }
        })
        .on("mouseout", function(d){
            if(d != "Change"){
                d3.select(this)
                .style("fill", "black");
            }
        })
        .on("click", function(d){
            if(d == "Delete"){
                if(updraw == 1 && SUNLOCK == 1){
                    if(Show_Sunbursts_all['up']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]]){
                        delete Show_Sunbursts_all['up']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]];
                    }
                }
                if(Show_Sunbursts_all['down']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]]){
                    delete Show_Sunbursts_all['down']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]];
                }
                Show_Sunbursts_all['down']['show_group_by'].splice(Show_Sunbursts_all['down']['show_group_by'].length - 1 - num, 1);
                if(updraw == 1 && SUNLOCK == 1){
                    Show_Sunbursts_all['up']['show_group_by'] = Show_Sunbursts_all['down']['show_group_by'].slice();
                }
                if(Show_Sunbursts_all['down']['show_group_by'].length == 0){
                    downdraw = 0;
                    var this_id = Show_Sunbursts_all['down']['left_index']
                    histogram_list[this_id]['color'] = Clickable_color;
                    var this_year_scale = Object.keys(histogram_list[this_id]['histogram_info']);
                    select_part[this_id][0] = this_year_scale[0];
                    select_part[this_id][1] = this_year_scale[this_year_scale.length - 1];
                    delete Show_Sunbursts_all['down'];
                    removeSunburst('down', 0);
                }
                else{
                    var number = 5;
                    (function() {
                        //var test = "http://98.220.5.15:1234/user";
                        var test = IP_address;
                        $.getJSON( test, {
                            num : number,
                            list: JSON.stringify(Show_Sunbursts_all['down']['paper_list']),
                            property: Show_Sunbursts_all['down']['show_property'],
                            group_by: JSON.stringify(Show_Sunbursts_all['down']['show_group_by']),
                            group_lists: JSON.stringify(Show_Sunbursts_all['down']['group_lists'])
                        })
                        .done(function( data ) {
                            if(data['num'] == '0'){
                                align_num = 0;
                                downdraw = 0;
                                drawSun('down', data['tree']);
                            }
                        });
                    })(); 
                }
                if(updraw == 1 && SUNLOCK == 1){
                    if(Show_Sunbursts_all['up']['show_group_by'].length == 0){
                        updraw = 0;
                        var this_id = Show_Sunbursts_all['up']['left_index']
                        histogram_list[this_id]['color'] = Clickable_color;
                        var this_year_scale = Object.keys(histogram_list[this_id]['histogram_info']);
                        select_part[this_id][0] = this_year_scale[0];
                        select_part[this_id][1] = this_year_scale[this_year_scale.length - 1];
                        delete Show_Sunbursts_all['up'];
                        removeSunburst('up', 0);
                    }
                    else{
                        var number = 5;
                        (function() {
                            //var test = "http://98.220.5.15:1234/user";
                            var test = IP_address;
                            $.getJSON( test, {
                                num : number,
                                list: JSON.stringify(Show_Sunbursts_all['up']['paper_list']),
                                property: Show_Sunbursts_all['up']['show_property'],
                                group_by: JSON.stringify(Show_Sunbursts_all['up']['show_group_by']),
                                group_lists: JSON.stringify(Show_Sunbursts_all['up']['group_lists'])
                            })
                            .done(function( data ) {
                                if(data['num'] == '0'){
                                    align_num = 0;
                                    updraw = 0;
                                    drawSun('up', data['tree']);
                                }
                            });
                        })(); 
                    }
                }
            }
            else if(d == "Group"){
                var element = document.getElementById("down_second_choice");
                element.parentNode.removeChild(element);

                var number = 6;
                (function() {
                    //var test = "http://98.220.5.15:1234/user";
                    var test = IP_address;
                    $.getJSON( test, {
                        num : number,
                        list: JSON.stringify(Show_Sunbursts_all['down']['paper_list']),
                        group_by: data.name
                    })
                    .done(function( re_data ) {
                        if(re_data['num'] == '0'){
                            draw_down_second_edit(data, num, re_data['paper_info'])
                        }
                    });
                })(); 
            }
        });

    down_second_choice.selectAll(".second_choice_text")
        .data(function(){
            var this_data = new Array();
            for(var i = 0; i<show_group_bys.length; i++){
                var this_true = 0;
                for(var j = 0; j<Show_Sunbursts_all['down']['show_group_by'].length; j++){
                    if(show_group_bys[i] == Show_Sunbursts_all['down']['show_group_by'][j]){
                        this_true = 1;
                    }
                }
                if(this_true == 0){
                    this_data.push(show_group_bys[i]);
                }
            }
            return this_data;
        })
        .enter().append("text")
        .attr("class", "second_choice_text")
        .attr("x", -110)
        .attr("y", function(d, i){
            return data.y + 15 + 13 * i;
        })
        .text(function(d){
            return d;
        })
        .style("fill", function(d){
            if(d == " —————————— "){
                return Unclickable_name_color;
            }
            return Clickable_name_color;
            // if(d.substring(0,2) == 'C.'){
            //     return "#57000d";
            // }
            // else{
            //     return "004529";
            // }
        })
        .style("font-size", 10)
        .style("font-family", "Arial")
        .on("mouseover", function(d){
            if(d != " —————————— "){
                d3.select(this)
                .style("fill", "orange")
                .style("cursor", "pointer");
            }
        })
        .on("mouseout", function(){
            d3.selectAll(".second_choice_text")
            .style("fill", function(d){
                if(d == " —————————— "){
                    return Unclickable_name_color;
                }
                return Clickable_name_color;
                // if(d.substring(0,2) == 'C.'){
                //     return "#57000d";
                // }
                // else{
                //     return "004529";
                // }
            });
        })
        .on("click", function(d){
            if(d != " —————————— "){
                if(Show_Sunbursts_all['down']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]]){
                    delete Show_Sunbursts_all['down']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]];
                }
                Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num] = d;
                var number = 5;
                (function() {
                    //var test = "http://98.220.5.15:1234/user";
                    var test = IP_address;
                    $.getJSON( test, {
                        num : number,
                        list: JSON.stringify(Show_Sunbursts_all['down']['paper_list']),
                        property: Show_Sunbursts_all['down']['show_property'],
                        group_by: JSON.stringify(Show_Sunbursts_all['down']['show_group_by']),
                        group_lists: JSON.stringify(Show_Sunbursts_all['down']['group_lists'])
                    })
                    .done(function( data ) {
                        if(data['num'] == '0'){
                            align_num = 0;
                            downdraw = 0;
                            drawSun('down', data['tree']);
                        }
                    });
                })(); 
    
                if(updraw == 1 && SUNLOCK == 1){
                    if(Show_Sunbursts_all['up']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]]){
                        delete Show_Sunbursts_all['up']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]];
                    }
                    
                    Show_Sunbursts_all['up']['show_group_by'] = Show_Sunbursts_all['down']['show_group_by'].slice();
                    var number = 5;
                    (function() {
                        //var test = "http://98.220.5.15:1234/user";
                        var test = IP_address;
                        $.getJSON( test, {
                            num : number,
                            list: JSON.stringify(Show_Sunbursts_all['up']['paper_list']),
                            property: Show_Sunbursts_all['up']['show_property'],
                            group_by: JSON.stringify(Show_Sunbursts_all['up']['show_group_by']),
                            group_lists: JSON.stringify(Show_Sunbursts_all['up']['group_lists'])
                        })
                        .done(function( data ) {
                            if(data['num'] == '0'){
                                align_num = 0;
                                updraw = 0;
                                drawSun('up', data['tree']);
                            }
                        });
                    })(); 
                    
                }
            }           
        });
}

function draw_down_second_edit(data, num, data_set){
    var down_second_choice = d3.select("#down_logo").append("g")
                            .attr("id", "down_second_choice_edit")
                            .attr("transform", "translate(0,0)");

    down_second_choice.append("rect")
        .attr("width", 400)
        .attr("height", 200)
        .attr("x", -400)
        .attr("y", function(){
            return data.y-10;
        })
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "white")//d3.rgb(128,177,211))
        .style("stroke", Clickable_name_color)
        .style("opacity", 0.9);
    
    down_second_choice.append("text")
        .text("x ")
        .attr("x", -390)
        .attr("y", function(){
            return data.y + 10;
        })
        .style("fill", Delete_color)
        .style("font-family", "verdana")
        .style("font-size", 20)
        .on("mouseover", function(){
            d3.select(this)
            .style("fill", "orange")
            .style("cursor", "pointer");
        })
        .on("mouseout", function(){
            d3.select(this)
            .style("fill", Delete_color);
        })
        .on("click", function(){
            var element = document.getElementById("down_second_choice_edit");
            element.parentNode.removeChild(element);

            if(Show_Sunbursts_all['down']['group_lists'].hasOwnProperty(data.name)){
                Show_Sunbursts_all['down']['group_lists'][data.name]['brushes'].splice( Show_Sunbursts_all['down']['group_lists'][data.name]['brushes'].length-1, 1);
            }

            d3.selectAll(".group_by")
            .style("fill", Clickable_name_color);
        });

    var second_title = ["Change", "|", "Group", "|", "Delete"];
    down_second_choice.selectAll(".second_title_text")
        .data(second_title)
        .enter().append("text")
        .attr("x", function(d,i){
            if(i == 0){
                return -115;
            }
            else if(i == 1){
                return -75;
            }
            else if(i == 2){
                return -69;
            }
            else if(i == 3){
                return -39;
            }
            else if(i == 4){
                return -33;
            }
        })
        .attr("y", function(){
            return data.y;
        })
        .text(function(d){
            return d;
        })
        .style("fill", function(d){
            if(d == "Group"){
                return "orange";
            }
            else{
                return "black";
            }
        })
        .style("font-size", 10)
        .style("font-family", "Arial")
        .on("mouseover", function(d){
            if(d != "|"){
                d3.select(this)
                .style("fill", "orange")
                .style("cursor", "pointer");
            }
        })
        .on("mouseout", function(d){
            if(d != "Group"){
                d3.select(this)
                .style("fill", "black");
            }
        })
        .on("click", function(d){
            if(d == "Delete"){
                if(updraw == 1 && SUNLOCK == 1){
                    if(Show_Sunbursts_all['up']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]]){
                        delete Show_Sunbursts_all['up']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]];
                    }
                }
                if(Show_Sunbursts_all['down']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]]){
                    delete Show_Sunbursts_all['down']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - num]];
                }
                Show_Sunbursts_all['down']['show_group_by'].splice(Show_Sunbursts_all['down']['show_group_by'].length - 1 - num, 1);
                if(updraw == 1 && SUNLOCK == 1){
                    Show_Sunbursts_all['up']['show_group_by'] = Show_Sunbursts_all['down']['show_group_by'].slice();
                }
                if(Show_Sunbursts_all['down']['show_group_by'].length == 0){
                    downdraw = 0;
                    var this_id = Show_Sunbursts_all['down']['left_index']
                    histogram_list[this_id]['color'] = Clickable_color;
                    var this_year_scale = Object.keys(histogram_list[this_id]['histogram_info']);
                    select_part[this_id][0] = this_year_scale[0];
                    select_part[this_id][1] = this_year_scale[this_year_scale.length - 1];
                    delete Show_Sunbursts_all['down'];
                    removeSunburst('down', 0);
                }
                else{
                    var number = 5;
                    (function() {
                        //var test = "http://98.220.5.15:1234/user";
                        var test = IP_address;
                        $.getJSON( test, {
                            num : number,
                            list: JSON.stringify(Show_Sunbursts_all['down']['paper_list']),
                            property: Show_Sunbursts_all['down']['show_property'],
                            group_by: JSON.stringify(Show_Sunbursts_all['down']['show_group_by']),
                            group_lists: JSON.stringify(Show_Sunbursts_all['down']['group_lists'])
                        })
                        .done(function( data ) {
                            if(data['num'] == '0'){
                                align_num = 0;
                                updraw = 0;
                                drawSun('down', data['tree']);
                            }
                        });
                    })(); 
                }
                if(updraw == 1 && SUNLOCK == 1){
                    if(Show_Sunbursts_all['up']['show_group_by'].length == 0){
                        updraw = 0;
                        var this_id = Show_Sunbursts_all['up']['left_index']
                        histogram_list[this_id]['color'] = Clickable_color;
                        var this_year_scale = Object.keys(histogram_list[this_id]['histogram_info']);
                        select_part[this_id][0] = this_year_scale[0];
                        select_part[this_id][1] = this_year_scale[this_year_scale.length - 1];
                        delete Show_Sunbursts_all['up'];
                        removeSunburst('up', 0);
                    }
                    else{
                        var number = 5;
                        (function() {
                            //var test = "http://98.220.5.15:1234/user";
                            var test = IP_address;
                            $.getJSON( test, {
                                num : number,
                                list: JSON.stringify(Show_Sunbursts_all['up']['paper_list']),
                                property: Show_Sunbursts_all['up']['show_property'],
                                group_by: JSON.stringify(Show_Sunbursts_all['up']['show_group_by']),
                                group_lists: JSON.stringify(Show_Sunbursts_all['up']['group_lists'])
                            })
                            .done(function( data ) {
                                if(data['num'] == '0'){
                                    align_num = 0;
                                    updraw = 0;
                                    drawSun('up', data['tree']);
                                }
                            });
                        })(); 
                    }
                }
            }
            else if(d == "Change"){
                var element = document.getElementById("down_second_choice_edit");
                element.parentNode.removeChild(element);
                
                draw_down_second_change(data, num);
            }
        });

    draw_group_histogram(down_second_choice, data, data_set, 'down');
}
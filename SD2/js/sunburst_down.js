function draw_down_sun(uid, data){
    var downsunburst = d3.select("#sunburst_map").append("div").attr("id", "downsunburst");

    //downsunburst.append("input")
    //        .attr("class", "down_slider")
    //        .attr("id", "down_slider")
    //        .attr("type", "range")
    //        .attr("min", 0)
    //        .attr("max", 640)
    //        .attr("value", 0)
    //        .attr("step", 1);

    //document.getElementById("down_slider").oninput = function(){
    //    drag_slider("down", this.value);
    //}
    
    draw_down_logo();
    draw_down_sunburst(uid, data, one_hist_width, 0, 1);

    var down_title = downsunburst.append("div").attr("class", "down_title");
    var down_title_line = down_title.append("span");


    down_title_line.append("text")
        .text("x ")
        .style("color", Delete_color)
        .style("font-family", "verdana")
        .style("font-size", 20)
        .on("mouseover", function(){
            d3.select(this)
            .style("color", "orange")
            .style("cursor", "pointer");
        })
        .on("mouseout", function(){
            d3.select(this)
            .style("color", Delete_color);
        })
        .on("click", function(){
            downdraw = 0;
            var this_id = Show_Sunbursts_all[uid]['left_index']
            histogram_list[this_id]['color'] = Clickable_color;
            var this_year_scale = Object.keys(histogram_list[this_id]['histogram_info']);
            select_part[this_id][0] = this_year_scale[0];
            select_part[this_id][1] = this_year_scale[this_year_scale.length - 1];
            delete Show_Sunbursts_all[uid];
            removeSunburst(uid, 0);
        });

    down_title_line.append("text")
        .text(function(){
            return Show_Sunbursts_all['down']['title_text_info'];
        })
        .style("font-family", "Arial")
        .style("font-size", 20)
        .style("color", Unclickable_name_color);
    
    downdraw = 1;
}

function draw_down_logo(){
    var down_sun_logo = d3.select("#show_sunbursts").append("g")
                    .attr("id", "down_logo")
                    .attr("transform", "translate(645,60)")
        
        // down_sun_logo.append("text")
        //         .attr("id", "down_scale_methods")
        //         .attr("x", 0)
        //         .attr("y", 455)
        //         .text(function(){
        //             if(scale_method % 3 == 0){
        //                 return "Linear";
        //             }
        //             else if(scale_method % 3 == 1){
        //                 return "Sqrt";
        //             }
        //             else{
        //                 return "Log";
        //             }
        //         })
        //         .style("font-size", 13)
        //         .style("font-family", "Arial")
        //         .style("fill", "steelblue")
        //         .on("mouseover", function(){
        //             if(scale_method % 3 == 0){
        //                 d3.select(this).text("Sqrt").style("fill", "orange");
        //             }
        //             else if(scale_method % 3 == 1){
        //                 d3.select(this).text("Log").style("fill", "orange");
        //             }
        //             else{
        //                 d3.select(this).text("Linear").style("fill", "orange");
        //             }

        //             d3.select(this)
        //             .style("cursor", "pointer");
        //         })
        //         .on("mouseout", function(){
        //             if(scale_method % 3 == 0){
        //                 d3.select(this).text("Linear").style("fill", "steelblue");
        //             }
        //             else if(scale_method % 3 == 1){
        //                 d3.select(this).text("Sqrt").style("fill", "steelblue");
        //             }
        //             else{
        //                 d3.select(this).text("Log").style("fill", "steelblue");
        //             }
        //         })
        //         .on("click", function(){
        //             scale_method += 1;
        //             if(scale_method % 3 == 1){
        //                 d3.select(this).text("Sqrt");
        //                 if(updraw == 1){
        //                     d3.select("#up_scale_methods").text("Sqrt");
        //                 }

        //                 yScale = function(info){
        //                     return 150.0/Math.sqrt(max_size) * Math.sqrt(info);
        //                 }

        //                 up_mini_yscale = function(info){
        //                     return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
        //                 }

        //                 down_mini_yscale = function(info){
        //                     return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
        //                 }
        //             }
        //             else if(scale_method % 3 == 2){
        //                 d3.select(this).text("Log");
        //                 if(updraw == 1){
        //                     d3.select("#up_scale_methods").text("Log");
        //                 }

        //                 //yScale = d3.scale.log()
        //                 //    .domain([0, max_size])
        //                 //    .range([0,150]);

        //                 yScale = function(info){
        //                     a = 150/Math.log(max_size + 1)
        //                     return a * Math.log(info + 1);
        //                 }

        //                 up_mini_yscale = function(info){
        //                     a = 18/Math.log(max_size + 1)
        //                     return a * Math.log(info + 1);
        //                 }

        //                 down_mini_yscale = function(info){
        //                     a = 18/Math.log(max_size + 1)
        //                     return a * Math.log(info + 1);
        //                 }
        //             }
        //             else if(scale_method % 3 == 0){
        //                 d3.select(this).text("Linear");
        //                 if(updraw == 1){
        //                     d3.select("#up_scale_methods").text("Linear");
        //                 }

        //                 yScale = function(info){
        //                     return (150.0/max_size) * info;
        //                 }

        //                 up_mini_yscale = function(info){
        //                     return (18.0/max_size) * info;
        //                 }

        //                 down_mini_yscale = function(info){
        //                     return (18.0/max_size) * info;
        //                 }
        //             }
        //             if(updraw == 1){
        //                 remove_map('up');
        //                 draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], yScale, one_hist_width, 0, 1);
        //             }
        //             if(downdraw == 1){
        //                 remove_map('down');
        //                 draw_down_sunburst('down', Show_Sunbursts_all['down']['tree'], yScale, one_hist_width, 0, 1);
        //             }
        //         });

        down_sun_logo.selectAll(".property")
                .data(function(){
                    return [Show_Sunbursts_all['down']['show_property']]
                })
                .enter().append("text")
                .attr("class", "property")
                .attr("x", 0)
                .attr("y", 145 + 250 + 30)
                .text(function(d){
                    return d;
                })
                .style("font-size", 13)
                .style("fill", Clickable_name_color)
                .style("font-family", "Arial")
                .on("mouseover", function(d){
                    add_hints("changeproperty");

                    d3.select(this)
                    .style("fill", "orange")
                    .style("cursor", "pointer");

                    var down_first_choice = d3.select("#down_logo").append("g")
                                            .attr("id", "down_first_choice")
                                            .attr("transform", "translate(0,0)");

                    down_first_choice.append("rect")
                        .attr("width", 90)
                        .attr("height", 50)
                        .attr("x", -90)
                        .attr("y", 135 + 250 +30)
                        .attr("rx", 5)
                        .attr("ry", 5)
                        .style("fill", "white")
                        .style("stroke", Clickable_name_color)
                        .style("opacity", 0.9)
                        .on("mouseout", function(){
                            var element = document.getElementById("down_first_choice");
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

                                d3.selectAll(".property")
                                .style("fill", Clickable_name_color);
                            }
                            }  
                        });
                    
                    down_first_choice.append("text")
                        .attr("x", -80)
                        .attr("y", 145 + 250+30)
                        .text("Change")
                        .style("fill", "orange")
                        .style("font-size", 10)
                        .style("font-family", "Arial");
                    
                    down_first_choice.selectAll(".first_choice_text")
                        .data(function(){
                            var this_data = new Array();
                            for(var i = 0; i<show_properties.length; i++){
                                if(show_properties[i] != Show_Sunbursts_all['down']['show_property']){
                                    this_data.push(show_properties[i]);
                                }
                            }
                            return this_data;
                        })
                        .enter().append("text")
                        .attr("class", "first_choice_text")
                        .attr("x", -80)
                        .attr("y", function(d, i){
                            return 160 + 10 * i + 250 +30;
                        })
                        .text(function(d){
                            return d;
                        })
                        .style("font-size", 10)
                        .style("font-family", "Arial")
                        .on("mouseover", function(){
                            d3.select(this)
                            .style("fill", "orange")
                            .style("cursor", "pointer");
                        })
                        .on("mouseout", function(){
                            d3.selectAll(".first_choice_text")
                            .style("fill", "black");
                        })
                        .on("click", function(d){
                            for(var uid in Show_Sunbursts_all){
                                Show_Sunbursts_all[uid]['show_property'] = d;
                            }
                            var number = 5;
                            (function() {
                                //var test = "http://98.220.5.15:1234/user";
                                var test = "http://140.82.48.134:1234/user";
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
                            if(Object.getOwnPropertyNames(Show_Sunbursts_all).length == 2 && SUNLOCK == 1){
                                (function() {
                                    //var test = "http://98.220.5.15:1234/user";
                                    var test = "http://140.82.48.134:1234/user";
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
                            // d3.selectAll(".property")
                            // .text(function(){
                            //     return d;
                            // })
                            // .style("fill", "steelblue");

                            // var element = document.getElementById("down_first_choice");
                            // element.parentNode.removeChild(element);
                        });
                })
                .on("mouseout", function(){
                    remove_hints();
                    var element = document.getElementById("down_first_choice");
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

                        d3.selectAll(".property")
                        .style("fill", Clickable_name_color);
                        }
                    }  
                });     

    down_logo_text = [];
    var begin = -1;
    for(var i = 0; i <  Show_Sunbursts_all['down']['show_group_by'].length; i++){
        down_logo_text[i] = new Object();
        down_logo_text[i].num = i;
        down_logo_text[i].x = 0;
        // if(i == 0){
        //     var y = (240 - 60)/2 + 10;
        // }
        down_logo_text[i].last = begin;
        down_logo_text[i].next = i + 1;
        begin = i;
        var y = 20 + 30 * i + 250;
        down_logo_text[i].y = y;
        down_logo_text[i].name = Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - 1 - i];
    }

        down_sun_logo.selectAll(".group_by")
                .data(down_logo_text)
                .enter().append("text")
                .attr("class", "group_by")
                .attr("x", function(d){
                    return d.x;
                })
                .attr("y", function(d){
                    return d.y;
                })
                .style("fill", Clickable_name_color)
                .style("font-size", 12)
                .style("font-family", "Arial")
                .text(function(d){
                    return d.name;
                })
                .on("mouseover", function(data, num){
                    d3.select(this)
                        .style("fill", "orange")
                        .style("cursor", "pointer");

                    add_hints("changeattributes");

                    draw_down_second_change(data, num);
                })
                .on("mouseout", function(){
                    remove_hints();
                    var element = document.getElementById("down_second_choice");
                    var el = window.document.body;
                    var judge = 0;
                    window.document.body.onmouseover = function(event){
                        el = event.target;
                        if(element != null){
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
                        else{
                            d3.selectAll(".group_by")
                            .style("fill", Clickable_name_color);
                        }
                    }  
                })
                .call(drag_logo);

        if(Show_Sunbursts_all['down']['show_group_by'].length < 4){
            var rect_y = 30 + 30 * (Show_Sunbursts_all['down']['show_group_by'].length-1) + 250;

            down_sun_logo.append("rect")
                .attr("id", "down_add_group_by")
                .attr("width", 20)
                .attr("height", 20)
                .attr("x", 0)
                .attr("y", rect_y)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", "url(#AndPattern")//"rgb(161,217,155)")
                .style("opacity", 0.5)
                .style("cursor", "pointer")
                .on("mouseover", function(){
                    d3.select(this)
                        .style("opacity", 1);
                    
                    add_hints("addattributes")
                })
                .on("mouseout", function(){
                    remove_hints();
                    var element = document.getElementById("down_third_choice");
                    var el = window.document.body;
                    var judge = 0;
                    window.document.body.onmouseover = function(event){
                        el = event.target;
                        if(element != null){
                        for(var i = 0; i < element.childNodes.length; i ++){
                            if(el == element.childNodes[i]){
                                judge = 1;
                            }
                        }
                        if(judge == 0 && element.parentNode != null){
                            element.parentNode.removeChild(element);
    
                            d3.select("#down_add_group_by")
                                .transition()
                                .duration(100)
                                .style("opacity", 0.5);
                        }
                        }
                        else{
                        d3.select("#down_add_group_by")
                        .transition()
                        .duration(100)
                        .style("opacity", 0.5);
                        }
                    }  
                })
                .on("click", function(){
                    d3.select(this)
                    .style("opacity", 1);

                    var down_third_choice = d3.select("#down_logo").append("g")
                        .attr("id", "down_third_choice")
                        .attr("transform", "translate(0,0)");
                    down_third_choice.append("rect")
                        .attr("width", 120)
                        .attr("height", 175)
                        .attr("x", -120)
                        .attr("y", function(){
                            return rect_y+10;
                        })
                        .attr("rx", 5)
                        .attr("ry", 5)
                        .style("fill", "white")
                        .style("stroke", Clickable_name_color)
                        .style("opacity", 0.9)
                        .on("mouseout", function(){
                            var element = document.getElementById("down_third_choice");
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
                                d3.select("#down_add_group_by")
                                    .transition()
                                    .duration(100)
                                    .style("opacity", 0.5);
                            }
                            }  
                        });

                    down_third_choice.append("text")
                        .attr("x", -110)
                        .attr("y", rect_y + 20) 
                        .style("fill", "orange")
                        .style("font-size", 10)
                        .style("font-family", "Arial")
                        .text("Add");


                    down_third_choice.selectAll(".third_choice_text")
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
                    .attr("class", "third_choice_text")
                    .attr("x", -110)
                    .attr("y", function(d, i){
                        return rect_y + 33 + 13 * i;
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
                        d3.selectAll(".third_choice_text")
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
                            Show_Sunbursts_all['down']['show_group_by'].push(d);
                            for(var j = Show_Sunbursts_all['down']['show_group_by'].length - 1; j > 0 ; j --){
                                Show_Sunbursts_all['down']['show_group_by'][j] = Show_Sunbursts_all['down']['show_group_by'][j-1];
                            }
                            Show_Sunbursts_all['down']['show_group_by'][0] = d;
                            var number = 5;
                            (function() {
                                //var test = "http://98.220.5.15:1234/user";
                                var test = "http://140.82.48.134:1234/user";
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
                                Show_Sunbursts_all['up']['show_group_by'] = Show_Sunbursts_all['down']['show_group_by'].slice();
                                var number = 5;
                                (function() {
                                    //var test = "http://98.220.5.15:1234/user";
                                    var test = "http://140.82.48.134:1234/user";
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
                });

            // down_sun_logo.append("text")
            //     .attr("transform", function(){
            //         return "translate(5," + (rect_y + 14) + ")";
            //     })
            //     .attr("pointer-events", "none")
            //     .style("font-family", "FontAwesome")
            //     .text("+")
        }

}

function draw_down_sunburst(uid, data, h_width, x_offset, mini_tag){
    remove_brush(uid);
    down_sun_g = d3.select("#sunbursts").append("g")
                                .attr("id", "down_sunburst")
                                .attr("transform", function(){
                                    if(x_offset == 0){
                                        return "translate(" + x_offset + ",0)";
                                    }
                                    else{
                                        return "translate(" + (320 - x_offset) + ",0)"; 
                                    }
                                });

    var downwidth = Show_Sunbursts_all[uid]['node_num'] * h_width;

    var down_partition = d3.layout.partition()
                    .size([downwidth, downheight])
                    .value(function() { return 1; })
                    .sort(null);
    
    downnodes = down_partition.nodes(data);
    
    var last = -1;
    var next = downnodes.length;
    var root = 1;
    for(var i = 0; i < downnodes.length; i++){
        downnodes[i].num = i;
        downnodes[i].color = 0;
        if(downnodes[i].depth == 1){
            downnodes[i].last = last;
            last = i;
            root = i;
        }
        else{
            downnodes[i].root = root;
        }
        var rotate = downnodes.length-1-i;
        if(downnodes[rotate].depth == 1){
            downnodes[rotate].next = next;
            next = rotate;
        }
        downnodes[i].num = i;
        downnodes[i].up = 0;
        if((Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - downnodes[i].depth] == 'P. Venue' ||  Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - downnodes[i].depth] == 'C. Venue') && downnodes[i].name == "~"){
            downnodes[i].name = 'OTHERS';
        }
        // else if((Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - downnodes[i].depth] == 'P. Venue Type' ||  Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - downnodes[i].depth] == 'C. Venue Type') && downnodes[i].name == ""){
        //     downnodes[i].name = '[O]';
        // }
        // if((Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - downnodes[i].depth] == 'P. CCF Rank' ||  Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - downnodes[i].depth] == 'C. CCF Rank') && downnodes[i].name == "Other"){
        //     downnodes[i].name = 'O';
        // }
    }

    for(var i = 0; i < downnodes.length; i++){
        if(downnodes[i].depth == 1){
            calculate_color(downnodes[i], downnodes);
        }
    }

    end_info['up'] = -1;
    end_info['down'] = root;

    down_sun_g.selectAll(".node")
            .data(downnodes)
            .enter().append("rect")
            .attr("class", "node")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) {
                if(d.depth == 0){
                    d.y = 310;
                }
                else{
                    d.y = 310 + 30 * (d.depth - 1);
                }
                return d.y;
            })
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d,i) {
                if(d.depth == 0){
                    d.dy = 0;
                }
                else if(d.depth == downnodes[downnodes.length-1].depth){
                    if(d.size > 0){
                        d.dy = yScale(d.size);
                    }
                    else{
                        d.dy = yScale(0);
                    }
                }
                else{
                    d.dy = 30;
                }
                return d.dy;
            })
            .style("fill", function(d){
                if(d.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['down'];
                }
            })
            .style("stroke", "white")
            .on("mouseover", function(d){
                d3.select(this)
                .style("cursor", "pointer");
    
                d3.select("#up_sunburst").selectAll(".node")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    }
                });

                d3.select("#down_sunburst").selectAll(".node")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['down'];
                        }
                    }
                });

                d3.select("#up_minimap").selectAll(".node")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    }
                });

                d3.select("#down_minimap").selectAll(".node")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['down'];
                        }
                    }
                });

                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    d3.select("#up_sunburst").selectAll(".bar")
                    .style("fill", function(one_rect){
                        if(d.name == one_rect.name){
                            return "orange";
                        }
                        else{
                            return up_down_colorlist['down'];
                        }
                    });
    
                    d3.select("#down_sunburst").selectAll(".bar")
                    .style("fill", function(one_rect){
                        if(d.name == one_rect.name){
                            return "orange";
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    });
                }

                d3.selectAll(".label")
                .style("opacity", function(one_text){
                    if(d.name == one_text.name && d.x == one_text.x && d.y == one_text.y){
                        return 1;
                    }
                    else{
                        if(one_text.dx <= 9){
                            return 0;
                        }
                        else{
                            return 1;
                        }
                    }
                });
    
                d3.select("#down_logo")
                .append("text")
                .attr("id", "down_show_text")
                .attr("x", -640)
                .attr("y", 505)
                .style("font-size", 13)
                .style("font-family", "Arial")
                .style("fill", "orange")
                .text(function(){
                    if(d.depth == Show_Sunbursts_all['down']['show_group_by'].length){
                        var size = 0;
                        if(d.size > -1){
                            size = d.size;
                        }
                        if(d.name == '[C]'){
                            return 'Conference' + " (" + size + ")";
                        }
                        else if(d.name == '[J]'){
                            return 'Journal' + " (" + size + ")";
                        }
                        else if(d.name == '[O]'){
                            return 'Others' + " (" + size + ")";
                        }
                        else if(d.name == 'A'){
                            return 'CCF Rank A' + " (" + size + ")";
                        }
                        else if(d.name == 'B'){
                            return 'CCF Rank B' + " (" + size + ")";
                        }
                        else if(d.name == 'C'){
                            return 'CCF Rank C' + " (" + size + ")";
                        }
                        else if(d.name == 'O'){
                            return 'Others' + " (" + size + ")";
                        }
                        else if(d.name == 'OTHERS'){
                            return 'Other Venues' + " (" + size + ")";
                        }
                        if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){
                            if(d.name.indexOf('~') != -1){
                                return d.name.substring(d.name.indexOf('~')+1, d.name.length) + " (" + size + ")";
                            }                        
                        }
                        return d.name + " (" + size + ")";
                    }
                    else if(Show_Sunbursts_all['down']['group_lists'].hasOwnProperty(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length-d.depth])){
                        var this_list = Show_Sunbursts_all['down']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length-d.depth]]['lists'];
                        var this_object = new Object();
                        Object.keys(this_list).forEach(function(key){
                            if(this_object.hasOwnProperty(this_list[key])){
                                this_object[this_list[key]].push(key);
                            }
                            else{
                                this_object[this_list[key]] = [];
                                this_object[this_list[key]].push(key);
                            }
                        });
                        var show_text = '';
                        if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){                        
                            if(d.name.indexOf('~') != -1){
                                show_text += d.name.substring(0, d.name.indexOf('~')) + ": ";
                            }
                            else{
                                show_text += d.name + ": ";
                            }
                            if(this_object[d.name].length == 1){
                                show_text += this_object[d.name][0].substring(this_object[d.name][0].indexOf('~')+1, this_object[d.name][0].length);
                            }
                            else{
                                for(var i = 0; i < this_object[d.name].length; i ++){
                                    show_text += this_object[d.name][i].substring(0, this_object[d.name][i].indexOf('~'));
                                    if(i != this_object[d.name].length -1){
                                        show_text += ", ";
                                    }
                                }
                            }
                        }
                        else{
                            show_text += d.name + ": ";
                            for(var i = 0; i < this_object[d.name].length; i ++){
                                show_text += this_object[d.name][i];
                                if(i != this_object[d.name].length -1){
                                    show_text += ", ";
                                }
                            }
                        }
                        return show_text;
                    }
                    else{
                        if(d.name == '[C]'){
                            return 'Conference';
                        }
                        else if(d.name == '[J]'){
                            return 'Journal';
                        }
                        else if(d.name == '[O]'){
                            return 'Others';
                        }
                        else if(d.name == 'A'){
                            return 'CCF Rank A';
                        }
                        else if(d.name == 'B'){
                            return 'CCF Rank B';
                        }
                        else if(d.name == 'C'){
                            return 'CCF Rank C';
                        }
                        else if(d.name == 'O'){
                            return 'Others';
                        }
                        else if(d.name == 'OTHERS'){
                            return 'Other Venues';
                        }
                        if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){
                            return d.name.substring(d.name.indexOf('~')+1, d.name.length);
                        }
                        return d.name;
                    }
                });
            })
            .on("mouseout", function(){
                d3.select("#down_sunburst").selectAll(".node")
                .style("fill", function(one_rect){
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['down'];
                    }
                });

                d3.select("#up_sunburst").selectAll(".node")
                .style("fill", function(one_rect){
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                });

                d3.select("#up_minimap").selectAll(".node")
                .style("fill", function(one_rect){
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                });

                d3.select("#down_minimap").selectAll(".node")
                .style("fill", function(one_rect){
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['down'];
                    }
                });

                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    d3.select("#up_sunburst").selectAll(".bar")
                    .style("fill", function(){
                        return up_down_colorlist['down'];
                    });
    
                    d3.select("#down_sunburst").selectAll(".bar")
                    .style("fill", function(){
                        return up_down_colorlist['up'];
                    });
                }

                d3.selectAll(".label")
                .style("opacity", function(one_text){
                    if(one_text.dx <= 9){
                        return 0;
                    }
                    else{
                        return 1;
                    }
                });    
    
                var down_show = document.getElementById("down_show_text");
                down_show.parentNode.removeChild(down_show);
            });
            //.call(drag);

    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
        down_sun_g.selectAll(".bars")
                .data(downnodes)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) {
                    if(d.depth == 0){
                        d.y = 310;
                    }
                    else{
                        d.y = 310 + 30 * (d.depth - 1);
                    }
                    return d.y;
                })
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d,i) {
                    if(d.depth == downnodes[downnodes.length-1].depth){
                        if(d.size > upnodes[i].size){
                            d.dy = yScale(upnodes[i].size);
                            if(upnodes[i].size == 0 || upnodes[i].size == -1){
                                d.dy = 2;
                            }
                        }
                        else{
                            d.dy = 0;
                        }
                    }
                    else{
                        d.dy = 0;
                    }
                    return d.dy;
                })
                .style("fill", up_down_colorlist['up'])
                .style("stroke", "white")
                .on("mouseover", function(d){
                    d3.select(this)
                    .style("cursor", "pointer");
        
                    d3.select("#up_sunburst").selectAll(".node")
                    .style("fill", function(one_rect){
                        if(d.name == one_rect.name){
                            return "orange";
                        }
                        else{
                            if(one_rect.color == 0){
                                return "white";
                            }
                            else{
                                return up_down_colorlist['up'];
                            }
                        }
                    });
    
                    d3.select("#down_sunburst").selectAll(".node")
                    .style("fill", function(one_rect){
                        if(d.name == one_rect.name){
                            return "orange";
                        }
                        else{
                            if(one_rect.color == 0){
                                return "white";
                            }
                            else{
                                return up_down_colorlist['down'];
                            }
                        }
                    });
    
                    d3.select("#up_minimap").selectAll(".node")
                    .style("fill", function(one_rect){
                        if(d.name == one_rect.name){
                            return "orange";
                        }
                        else{
                            if(one_rect.color == 0){
                                return "white";
                            }
                            else{
                                return up_down_colorlist['up'];
                            }
                        }
                    });
    
                    d3.select("#down_minimap").selectAll(".node")
                    .style("fill", function(one_rect){
                        if(d.name == one_rect.name){
                            return "orange";
                        }
                        else{
                            if(one_rect.color == 0){
                                return "white";
                            }
                            else{
                                return up_down_colorlist['down'];
                            }
                        }
                    });
    
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        d3.select("#up_sunburst").selectAll(".bar")
                        .style("fill", function(one_rect){
                            if(d.name == one_rect.name){
                                return "orange";
                            }
                            else{
                                return up_down_colorlist['down'];
                            }
                        });
        
                        d3.select("#down_sunburst").selectAll(".bar")
                        .style("fill", function(one_rect){
                            if(d.name == one_rect.name){
                                return "orange";
                            }
                            else{
                                return up_down_colorlist['up'];
                            }
                        });
                    }
    
                    d3.selectAll(".label")
                    .style("opacity", function(one_text){
                        if(d.name == one_text.name && d.x == one_text.x && d.y == one_text.y){
                            return 1;
                        }
                        else{
                            if(one_text.dx <= 9){
                                return 0;
                            }
                            else{
                                return 1;
                            }
                        }
                    });
        
                    d3.select("#down_logo")
                    .append("text")
                    .attr("id", "down_show_text")
                    .attr("x", -640)
                    .attr("y", 505)
                    .style("font-size", 13)
                    .style("font-family", "Arial")
                    .style("fill", "orange")
                    .text(function(){
                        if(d.depth == Show_Sunbursts_all['down']['show_group_by'].length){
                            var size = 0;
                            if(d.size > -1){
                                size = d.size;
                            }
                            if(d.name == '[C]'){
                                return 'Conference' + " (" + size + ")";
                            }
                            else if(d.name == '[J]'){
                                return 'Journal' + " (" + size + ")";
                            }
                            else if(d.name == '[O]'){
                                return 'Others' + " (" + size + ")";
                            }
                            else if(d.name == 'A'){
                                return 'CCF Rank A' + " (" + size + ")";
                            }
                            else if(d.name == 'B'){
                                return 'CCF Rank B' + " (" + size + ")";
                            }
                            else if(d.name == 'C'){
                                return 'CCF Rank C' + " (" + size + ")";
                            }
                            else if(d.name == 'O'){
                                return 'Others' + " (" + size + ")";
                            }
                            else if(d.name == 'OTHERS'){
                                return 'Other Venues' + " (" + size + ")";
                            }
                            if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){
                                if(d.name.indexOf('~') != -1){
                                    return d.name.substring(d.name.indexOf('~')+1, d.name.length) + " (" + size + ")";
                                }                        
                            }
                            return d.name + " (" + size + ")";
                        }
                        else if(Show_Sunbursts_all['down']['group_lists'].hasOwnProperty(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length-d.depth])){
                            var this_list = Show_Sunbursts_all['down']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length-d.depth]]['lists'];
                            var this_object = new Object();
                            Object.keys(this_list).forEach(function(key){
                                if(this_object.hasOwnProperty(this_list[key])){
                                    this_object[this_list[key]].push(key);
                                }
                                else{
                                    this_object[this_list[key]] = [];
                                    this_object[this_list[key]].push(key);
                                }
                            });
                            var show_text = '';
                            if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){                        
                                if(d.name.indexOf('~') != -1){
                                    show_text += d.name.substring(0, d.name.indexOf('~')) + ": ";
                                }
                                else{
                                    show_text += d.name + ": ";
                                }
                                if(this_object[d.name].length == 1){
                                    show_text += this_object[d.name][0].substring(this_object[d.name][0].indexOf('~')+1, this_object[d.name][0].length);
                                }
                                else{
                                    for(var i = 0; i < this_object[d.name].length; i ++){
                                        show_text += this_object[d.name][i].substring(0, this_object[d.name][i].indexOf('~'));
                                        if(i != this_object[d.name].length -1){
                                            show_text += ", ";
                                        }
                                    }
                                }
                            }
                            else{
                                show_text += d.name + ": ";
                                for(var i = 0; i < this_object[d.name].length; i ++){
                                    show_text += this_object[d.name][i];
                                    if(i != this_object[d.name].length -1){
                                        show_text += ", ";
                                    }
                                }
                            }
                            return show_text;
                        }
                        else{
                            if(d.name == '[C]'){
                                return 'Conference';
                            }
                            else if(d.name == '[J]'){
                                return 'Journal';
                            }
                            else if(d.name == '[O]'){
                                return 'Others';
                            }
                            else if(d.name == 'A'){
                                return 'CCF Rank A';
                            }
                            else if(d.name == 'B'){
                                return 'CCF Rank B';
                            }
                            else if(d.name == 'C'){
                                return 'CCF Rank C';
                            }
                            else if(d.name == 'O'){
                                return 'Others';
                            }
                            else if(d.name == 'OTHERS'){
                                return 'Other Venues';
                            }
                            if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){
                                return d.name.substring(d.name.indexOf('~')+1, d.name.length);
                            }
                            return d.name;
                        }
                    });
                })
                .on("mouseout", function(){
                    d3.select("#down_sunburst").selectAll(".node")
                    .style("fill", function(one_rect){
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['down'];
                        }
                    });
    
                    d3.select("#up_sunburst").selectAll(".node")
                    .style("fill", function(one_rect){
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    });
    
                    d3.select("#up_minimap").selectAll(".node")
                    .style("fill", function(one_rect){
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    });
    
                    d3.select("#down_minimap").selectAll(".node")
                    .style("fill", function(one_rect){
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['down'];
                        }
                    });
    
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        d3.select("#up_sunburst").selectAll(".bar")
                        .style("fill", function(){
                            return up_down_colorlist['down'];
                        });
        
                        d3.select("#down_sunburst").selectAll(".bar")
                        .style("fill", function(){
                            return up_down_colorlist['up'];
                        });
                    }
    
                    d3.selectAll(".label")
                    .style("opacity", function(one_text){
                        if(one_text.dx <= 9){
                            return 0;
                        }
                        else{
                            return 1;
                        }
                    });    
        
                    var down_show = document.getElementById("down_show_text");
                    down_show.parentNode.removeChild(down_show);
                });
    }

    down_sun_g.selectAll(".ticks")
            .data([50, 100, 150])
            .enter()
            .append("rect")
            .attr("class", "ticks")
            .attr("x", function(){
                if(x_offset == 0){
                    return x_offset;
                }
                else{
                    return x_offset - 320; 
                }
            })
            .attr("y", function(d){
                return 310 + d + 30*(downnodes[downnodes.length-1].depth-1);
            })
            .attr("width", 640)
            .attr("height", 1)
            .style("fill", "darkgray")
            .style("opacity", 0.2);
    
    down_sun_g.selectAll(".ticks_text")
            .data([50, 100, 150])
            .enter()
            .append("text")
            .text(function(d){
                if(scale_method % 3 == 0){
                    return Math.round(d * max_size / 150);
                }
                else if(scale_method % 3 == 1){
                    return Math.round(Math.pow((d*Math.sqrt(max_size)/150), 2));
                }
                else if(scale_method % 3 == 2){
                    return Math.round(Math.pow(Math.E, (d*Math.log(max_size+1)/150)) - 1);
                }
            })
            .attr("class", "ticks_text")
            .attr("x", function(){
                if(x_offset == 0){
                    return x_offset + 2;
                }
                else{
                    return x_offset - 320 + 2; 
                }
            })
            .attr("y", function(d){
                return 310 + d + 30*(downnodes[downnodes.length-1].depth-1) + 9;
            })
            .style("font-size", 10)
            .style("font-family", "Arial")
            .style("fill", "darkgray");

    down_sun_g.selectAll(".label")
            .data(downnodes.filter(function(d,i) { 
                //return (d.dx > 6 && i && (d.size == undefined)); }))
                return (i); }))
            .enter().append("text")
            .attr("class", "label")
            .style("font-size", 10)
            .style("font-family", "Arial")
            .style("text-anchor", function(d){
                if(typeof(d.size) == "undefined"){
                    return "middle";
                }
                return "start";
            })
            .attr("transform", function(d) { 
                //console.log(d.size)
                if(typeof(d.size) == "undefined"){
                    if(Show_Sunbursts_all['down']['group_lists'].hasOwnProperty(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length-d.depth])){
                        if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] != "P. Venue" && Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] != "C. Venue"){
                            if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                                return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy/2+20) + ")";
                            }
                            return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy/2+5) + ")"; 
                        }
                    }
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2 + 15) + ")rotate(90)";
                    }
                    return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2) + ")rotate(90)";
                }
                else{
                    return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + 5) + ")rotate(90)"; 
                }
            })
            .text(function(d) {
                if(d.depth == Show_Sunbursts_all['down']['show_group_by'].length && Show_Sunbursts_all['down']['show_group_by'][0] == "Individual Paper"){
                    return '';
                }
                else if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "Individual Paper"){
                    return d.name.substring(0,5) + '...';
                }
                else{
                    if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){
                        if(d.name.indexOf('~') != -1){
                            return d.name.substring(0, d.name.indexOf('~'));
                        }
                    }
                    return d.name;
                }
            })
            .style("opacity", function(d){
                if(d.dx <= 9){
                    return 0;
                }
                else{
                    return 1;
                }
            })
            .on("mouseover", function(d){
                d3.select(this)
                .style("cursor", "pointer")
                .style("opacity", 1);
    
                d3.select("#up_sunburst").selectAll(".node")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    }
                });

                d3.select("#down_sunburst").selectAll(".node")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['down'];
                        }
                    }
                });

                d3.select("#up_minimap").selectAll(".node")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    }
                });

                d3.select("#down_minimap").selectAll(".node")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        if(one_rect.color == 0){
                            return "white";
                        }
                        else{
                            return up_down_colorlist['down'];
                        }
                    }
                });

                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    d3.select("#up_sunburst").selectAll(".bar")
                    .style("fill", function(one_rect){
                        if(d.name == one_rect.name){
                            return "orange";
                        }
                        else{
                            return up_down_colorlist['down'];
                        }
                    });
    
                    d3.select("#down_sunburst").selectAll(".bar")
                    .style("fill", function(one_rect){
                        if(d.name == one_rect.name){
                            return "orange";
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    });
                }
    
                d3.select("#down_logo")
                .append("text")
                .attr("id", "down_show_text")
                .attr("x", -640)
                .attr("y", 505)
                .style("font-size", 13)
                .style("font-family", "Arial")
                .style("fill", "orange")
                .text(function(){
                    if(d.depth == Show_Sunbursts_all['down']['show_group_by'].length){
                        var size = 0;
                        if(d.size > -1){
                            size = d.size;
                        }
                        if(d.name == '[C]'){
                            return 'Conference' + " (" + size + ")";
                        }
                        else if(d.name == '[J]'){
                            return 'Journal' + " (" + size + ")";
                        }
                        else if(d.name == '[O]'){
                            return 'Others' + " (" + size + ")";
                        }
                        else if(d.name == 'A'){
                            return 'CCF Rank A' + " (" + size + ")";
                        }
                        else if(d.name == 'B'){
                            return 'CCF Rank B' + " (" + size + ")";
                        }
                        else if(d.name == 'C'){
                            return 'CCF Rank C' + " (" + size + ")";
                        }
                        else if(d.name == 'O'){
                            return 'Others' + " (" + size + ")";
                        }
                        else if(d.name == 'OTHERS'){
                            return 'Other Venues' + " (" + size + ")";
                        }
                        if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){
                            if(d.name.indexOf('~') != -1){
                                return d.name.substring(d.name.indexOf('~')+1, d.name.length) + " (" + size + ")";
                            }                        
                        }
                        return d.name + " (" + size + ")";
                    }
                    else if(Show_Sunbursts_all['down']['group_lists'].hasOwnProperty(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length-d.depth])){
                        var this_list = Show_Sunbursts_all['down']['group_lists'][Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length-d.depth]]['lists'];
                        var this_object = new Object();
                        Object.keys(this_list).forEach(function(key){
                            if(this_object.hasOwnProperty(this_list[key])){
                                this_object[this_list[key]].push(key);
                            }
                            else{
                                this_object[this_list[key]] = [];
                                this_object[this_list[key]].push(key);
                            }
                        });
                        var show_text = '';
                        if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){                        
                            if(d.name.indexOf('~') != -1){
                                show_text += d.name.substring(0, d.name.indexOf('~')) + ": ";
                            }
                            else{
                                show_text += d.name + ": ";
                            }
                            if(this_object[d.name].length == 1){
                                show_text += this_object[d.name][0].substring(this_object[d.name][0].indexOf('~')+1, this_object[d.name][0].length);
                            }
                            else{
                                for(var i = 0; i < this_object[d.name].length; i ++){
                                    show_text += this_object[d.name][i].substring(0, this_object[d.name][i].indexOf('~'));
                                    if(i != this_object[d.name].length -1){
                                        show_text += ", ";
                                    }
                                }
                            }
                        }
                        else{
                            show_text += d.name + ": ";
                            for(var i = 0; i < this_object[d.name].length; i ++){
                                show_text += this_object[d.name][i];
                                if(i != this_object[d.name].length -1){
                                    show_text += ", ";
                                }
                            }
                        }
                        return show_text;
                    }
                    else{
                        if(d.name == '[C]'){
                            return 'Conference';
                        }
                        else if(d.name == '[J]'){
                            return 'Journal';
                        }
                        else if(d.name == '[O]'){
                            return 'Others';
                        }
                        else if(d.name == 'A'){
                            return 'CCF Rank A';
                        }
                        else if(d.name == 'B'){
                            return 'CCF Rank B';
                        }
                        else if(d.name == 'C'){
                            return 'CCF Rank C';
                        }
                        else if(d.name == 'O'){
                            return 'Others';
                        }
                        else if(d.name == 'OTHERS'){
                            return 'Other Venues';
                        }
                        if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){
                            return d.name.substring(d.name.indexOf('~')+1, d.name.length);
                        }
                        return d.name;
                    }
                });
            })
            .on("mouseout", function(){
                d3.select(this)
                .style("opacity", function(d){
                    if(d.dx <= 9){
                        return 0;
                    }
                    else{
                        return 1;
                    }
                });

                d3.select("#down_sunburst").selectAll(".node")
                .style("fill", function(one_rect){
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['down'];
                    }
                });

                d3.select("#up_sunburst").selectAll(".node")
                .style("fill", function(one_rect){
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                });

                d3.select("#up_minimap").selectAll(".node")
                .style("fill", function(one_rect){
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                });

                d3.select("#down_minimap").selectAll(".node")
                .style("fill", function(one_rect){
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['down'];
                    }
                });

                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    d3.select("#up_sunburst").selectAll(".bar")
                    .style("fill", function(){
                        return up_down_colorlist['down'];
                    });
    
                    d3.select("#down_sunburst").selectAll(".bar")
                    .style("fill", function(){
                        return up_down_colorlist['up'];
                    });
                }
        
                var down_show = document.getElementById("down_show_text");
                down_show.parentNode.removeChild(down_show);
            });

    if(mini_tag == 1){
        if(change_scale_signal == 0){
            add_down_mini_map(uid, data, [0,640])
        }
        else{
            add_down_mini_map(uid, data, down_mini_brush.extent());
        }
    }
    //add_down_mini_map(uid, data, yScale, orign_extent)
    // if(mini_tag == 1 && h_width < 12){
    //     ADD_brush(uid, data, yScale, downnodes[downnodes.length-1].depth -1);
    // } 
}

function ADD_brush(uid, data, yScale, h_depth){
    var brush_xScale = d3.scale.linear()
                    .domain([0,640])
                    .range([0,640])

    var brush = d3.svg.brush().x(brush_xScale).extent([0,0]);

        var gBrush = d3.select("#sunbursts").append("g").attr("class", "down_brush").call(brush)
                    .attr("transform",function(){
                        return "translate(0, 310)";
                    });
            gBrush.selectAll("rect").attr("height", (30*h_depth + yScale(Show_Sunbursts_all[uid]['max_size'])));
            //gBrush.selectAll(".resize").append("path").attr("d", resizePath);
                    
    brush.on("brushstart.chart", function(){
    });

    brush.on("brush.chart", function(){
        var extent = brush.extent();
        var nodes = document.getElementById("down_sunburst").childNodes;

        for(var i = 0; i<nodes.length; i++){
            if(nodes[i].tagName == 'rect'){
                if((nodes[i].x.animVal.value >= extent[0]) && (nodes[i].x.animVal.value < extent[1])){
                    d3.select(nodes[i]).style("opacity", 1);
                }
                else{
                    d3.select(nodes[i]).style("opacity", 0.5);
                }
            }
        }
    });

    brush.on("brushend.chart", function() {
        var extent = brush.extent();
        var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all[uid]['node_num'] * 12;
        console.log(x_offset)
        
        console.log(extent)

        remove_show_text(uid);
        remove_map(uid); 

        draw_down_sunburst(uid, data, 12, x_offset, 0);
        draw_minimap = 1;
        down_width = 12;
        var mini_extent_left = (extent[0] + extent[1])/2 - 320/12 * one_hist_width;
        if(mini_extent_left <= 0){
            mini_extent_left = 0;
        }
        var mini_extent_right = (extent[0] + extent[1])/2 + 320/12 * one_hist_width;
        if(mini_extent_right > 640){
            mini_extent_right = 640;
        }
        add_down_mini_map(uid, data, [mini_extent_left, mini_extent_right], x_offset);

        if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
            remove_show_text('up');
            remove_map('up');

            draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], 12, x_offset, 0);
            up_width = 12;
            add_up_mini_map('up', Show_Sunbursts_all['up']['tree'], [mini_extent_left, mini_extent_right], x_offset);
        }
    });
}

var down_width = 12;
var down_mini_brush;
function add_down_mini_map(uid, data, orign_extent){
    down_map = d3.select("#show_sunbursts").append("svg")
                .attr("id", "down_mini")
                .attr("class", "down_mini")
                .style("width", 650)
                .style("height", 30);

    down_mini_g = down_map.append("g")
                .attr("id", "down_minimap")
                .attr("transform", function(){
                    return "translate(0,575)";
                });
    
    down_mini_g.append("rect")
            .attr("x", 0)
            .attr("y", -2)
            .attr("width", 640)
            .attr("height", 2)
            .style("fill", up_down_colorlist['down'])
            .style("stroke", "white");

    // down_mini_g.append("text")
    //         .text("x ")
    //         .style("fill", d3.rgb(128,177,211))
    //         .attr("x", 645)
    //         .attr("y", 5)
    //         .style("font-family", "verdana")
    //         .style("font-size", 13)
    //         .on("mouseover", function(){
    //             d3.select(this)
    //             .style("fill", "red")
    //             .style("cursor", "pointer");
    //         })
    //         .on("mouseout", function(){
    //             d3.select(this)
    //             .style("fill", d3.rgb(128,177,211));
    //         })
    //         .on("click", function(){
    //             remove_minimap(uid);
    //             remove_map(uid);
    //             draw_down_sunburst(uid, data, yScale, one_hist_width, 0, 1);

    //             if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
    //                 remove_minimap('up');
    //                 remove_map('up');
    //                 draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], yScale, one_hist_width, 0, 1);
    //             }
    //         });
    
    var downwidth = Show_Sunbursts_all[uid]['node_num'] * one_hist_width;

    var down_mini_partition = d3.layout.partition()
                .size([downwidth, 30])
                .value(function() { return 1; })
                .sort(null);
    
    var down_mini_nodes = down_mini_partition.nodes(data);

    //var down_mini_yscale = d3.scale.linear()
    //            .domain([0, Show_Sunbursts_all[uid]['max_size']])
    //            .range([0,18]);

    down_mini_g.selectAll(".node")
                .data(down_mini_nodes)
                .enter().append("rect")
                .attr("class", "node")
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) {
                    if(d.depth == 0){
                        d.y = 0;
                    }
                    else{
                        d.y = 4 * (d.depth - 1);
                    }
                    return d.y;
                })
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d,i) {
                    if(d.depth == 0){
                        d.dy = 0;
                    }
                    else if(d.depth == down_mini_nodes[down_mini_nodes.length-1].depth){
                        if(d.size > 0){
                            d.dy = down_mini_yscale(d.size);
                        }
                        else{
                            d.dy = down_mini_yscale(0);
                        }
                    }
                    else{
                        d.dy = 4;
                    }
                    return d.dy;
                })
                .style("fill", up_down_colorlist['down'])
                .style("stroke", "white");
                
                var brush_width = 0;

                var brush_xScale = d3.scale.linear()
                .domain([0,640])
                .range([0,640])

                down_mini_brush = d3.svg.brush().x(brush_xScale).extent(orign_extent);

                var gBrush = down_map.append("g").attr("class", "brush").attr("id", "down_mini_brush")
                            .call(down_mini_brush)
                            .attr("transform",function(){
                                return "translate(0,573)";
                            });
                            
                    gBrush.selectAll("rect").attr("height", 30);
                    //gBrush.selectAll(".resize").append("path").attr("d", resizePath);
                                
                down_mini_brush.on("brushstart.chart", function(){
                    var extent = down_mini_brush.extent();
                    brush_width = extent[1] - extent[0];
                });

                down_mini_brush.on("brush.chart", function(){
                    var extent = down_mini_brush.extent();

                    var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all[uid]['node_num'] * down_width;
                    if(updraw == 1){
                        if(Show_Sunbursts_all['up']['node_num'] > Show_Sunbursts_all['down']['node_num']){
                            x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['up']['node_num'] * down_width;
                        }
                        if(Show_Sunbursts_all['up']['node_num'] < 32 && Show_Sunbursts_all['down']['node_num'] < 32){
                            x_offset = (extent[1]+extent[0])/2/640*32 * down_width;
                        }
                    }
                    else if(Show_Sunbursts_all['down']['node_num'] < 32){
                        x_offset = (extent[1]+extent[0])/2/640*32 * down_width;
                    }
                    // if(extent[1] - extent[0] == brush_width){
                    //     drag_slider(uid, 320 - x_offset);

                    //     if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    //         up_mini_brush.extent(extent);
                    //         d3.select("#up_mini_brush").call(up_mini_brush);
                    //         drag_slider('up', 320 - x_offset);
                    //     }
                    // }
                    //else{
                    down_width = 640 / ((extent[1] - extent[0]) / one_hist_width);

                    remove_show_text('down');
                    remove_map(uid);
                    draw_down_sunburst(uid, data, down_width, x_offset, 0);

                    if(updraw == 1 && downdraw == 1 && lock_num%2 == 0){
                        if((extent[1] - extent[0]) != brush_width || align_num % 2 == 1){
                            up_mini_brush.extent(extent);
                            d3.select("#up_mini_brush").call(up_mini_brush);
                            remove_show_text('up');
                            remove_map('up');
                            up_width = down_width;
                            draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], up_width, x_offset, 0);
                        }
                    }
                    //}

                    var nodes = document.getElementById("down_minimap").childNodes;

                    for(var i = 0; i<nodes.length; i++){
                        if(nodes[i].tagName == 'rect'){
                            if((nodes[i].x.animVal.value >= extent[0]) && ((nodes[i].x.animVal.value+nodes[i].width.animVal.value) <= extent[1])){
                                d3.select(nodes[i]).style("opacity", 1);
                            }
                            else{
                                d3.select(nodes[i]).style("opacity", 0.3);
                            }
                        }
                    }

                    if(updraw == 1 && downdraw == 1 && lock_num%2 == 0){
                        if((extent[1] - extent[0]) != brush_width || align_num % 2 == 1){
                            nodes = document.getElementById("up_minimap").childNodes;
                            for(var i = 0; i<nodes.length; i++){
                                if(nodes[i].tagName == 'rect'){
                                    if((nodes[i].x.animVal.value >= extent[0]) && ((nodes[i].x.animVal.value+nodes[i].width.animVal.value) <= extent[1])){
                                        d3.select(nodes[i]).style("opacity", 1);
                                    }
                                    else{
                                        d3.select(nodes[i]).style("opacity", 0.3);
                                    }
                                }
                            }
                        }
                    }
                });

                down_mini_brush.on("brushend.chart", function() {
                    var extent = down_mini_brush.extent();
                    brush_width = extent[1] - extent[0];
                    var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all[uid]['node_num'] * down_width;

                    if(brush_width == 0){
                        down_width = one_hist_width;
                        x_offset = 0;
                        extent = [0,640];
                        down_mini_brush.extent(extent);
                        d3.select("#down_mini_brush").call(down_mini_brush);
                    }
                    else{
                        down_width = 640 / ((extent[1] - extent[0]) / one_hist_width);
                        if(updraw == 1){
                            if(Show_Sunbursts_all['up']['node_num'] > Show_Sunbursts_all['down']['node_num']){
                                x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['up']['node_num'] * down_width;
                            }
                            if(Show_Sunbursts_all['up']['node_num'] < 32 && Show_Sunbursts_all['down']['node_num'] < 32){
                                x_offset = (extent[1]+extent[0])/2/640*32 * down_width;
                            }
                        }
                        else if(Show_Sunbursts_all['down']['node_num'] < 32){
                            x_offset = (extent[1]+extent[0])/2/640*32 * down_width;
                        }
                    }
                    
                    remove_show_text('down');
                    remove_map(uid);
                    draw_down_sunburst(uid, data, down_width, x_offset, 0);

                    var nodes = document.getElementById("down_minimap").childNodes;

                    for(var i = 0; i<nodes.length; i++){
                        if(nodes[i].tagName == 'rect'){
                            if((nodes[i].x.animVal.value >= extent[0]) && ((nodes[i].x.animVal.value+nodes[i].width.animVal.value) <= extent[1])){
                                d3.select(nodes[i]).style("opacity", 1);
                            }
                            else{
                                d3.select(nodes[i]).style("opacity", 0.3);
                            }
                        }
                    }

                    if(updraw == 1 && downdraw == 1 && lock_num%2 == 0){
                        if((extent[1] - extent[0]) != brush_width || align_num % 2 == 1){
                            up_mini_brush.extent(extent);
                            d3.select("#up_mini_brush").call(up_mini_brush);
                            remove_show_text('up');
                            remove_map('up');
                            up_width = down_width;
                            draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], up_width, x_offset, 0);

                            nodes = document.getElementById("down_minimap").childNodes;
                            for(var i = 0; i<nodes.length; i++){
                                if(nodes[i].tagName == 'rect'){
                                    if((nodes[i].x.animVal.value >= extent[0]) && ((nodes[i].x.animVal.value+nodes[i].width.animVal.value) <= extent[1])){
                                        d3.select(nodes[i]).style("opacity", 1);
                                    }
                                    else{
                                        d3.select(nodes[i]).style("opacity", 0.3);
                                    }
                                }
                            }
                        }
                    }
                });

}
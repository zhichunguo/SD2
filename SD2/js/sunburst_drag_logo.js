var originx_logo, originy_logo;
var up;
var logo_text;

var drag_logo = d3.behavior.drag()
    .origin(function(d) { 
            return d;
    })
    .on("dragstart", dragstarted_logo)
    .on("drag", dragged_logo)
    .on("dragend", dragended_logo);

function dragstarted_logo(d){
    originx_logo = d.x;
    originy_logo = d.y;
    if(d.y < 250){
        up = 1;
        logo_text = up_logo_text;
    }   
    if(d.y > 250){
        up = 0;
        logo_text = down_logo_text;
    }
    console.log(logo_text)
}

function dragged_logo(d){
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    if(d.next < logo_text.length){
        if(d.y >= logo_text[d.next].y){
            var next = d.next;
            var temp_y = logo_text[next].y;
            if(d.last >= 0){
                logo_text[d.last].next = d.next;
            }
            if(logo_text[logo_text[d.next].next] != undefined){
                logo_text[logo_text[d.next].next].last = d.num;
            }
            d.next = logo_text[next].next;
            logo_text[next].next = d.num;
            logo_text[next].last = d.last;
            d.last = next;
            logo_text[next].y = originy_logo;
            d.y = temp_y;
            originy_logo = temp_y;
        }
    }
    if(d.last >= 0){
        if(d.y <= logo_text[d.last].y){
            var last = d.last;
            var temp_y = logo_text[d.last].y;
            if(d.next < logo_text.length){
                logo_text[d.next].last = d.last;
            }
            if(logo_text[logo_text[d.last].last] != undefined){
                logo_text[logo_text[d.last].last].next = d.num;
            }
            d.last = logo_text[d.last].last;
            logo_text[last].next = d.next;
            logo_text[last].last = d.num;
            d.next = last;
            logo_text[last].y = originy_logo;
            d.y = temp_y;
            originy_logo = temp_y;
        }
    }
    if(up == 1){
        d3.select("#up_logo").selectAll(".group_by")
            .attr("y", function(d){
                //console.log("change")
                return d.y;
            })
    }
    else{
        d3.select("#down_logo").selectAll(".group_by")
            .attr("y", function(d){
                return d.y;
            })
    }
}

function dragended_logo(d){
    d.x = originx_logo;
    d.y = originy_logo;
    console.log(SUNLOCK)
    if(up == 1){
        d3.select("#up_logo").selectAll(".group_by")
            .attr("y", function(d){
                return d.y;
            })
        
        var first;
        for(var i = 0; i<logo_text.length; i++){
            if(logo_text[i].last == -1){
                first = i;
            }
        }
        var num = 0;
        while(logo_text[first]){
            Show_Sunbursts_all['up']['show_group_by'][num] = logo_text[first].name;
            first = logo_text[first].next;
            num += 1;
        }
        
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
        
        if(downdraw == 1 && SUNLOCK == 1){
            Show_Sunbursts_all['down']['show_group_by'] = Show_Sunbursts_all['up']['show_group_by'];
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
    }
    else{
        d3.select("#down_logo").selectAll(".group_by")
            .attr("y", function(node){
                return node.y;
            })

        var first;
        for(var i = 0; i<logo_text.length; i++){
            if(logo_text[i].last == -1){
                first = i;
            }
        }
        var num = Show_Sunbursts_all['down']['show_group_by'].length - 1;
        while(logo_text[first]){
            Show_Sunbursts_all['down']['show_group_by'][num] = logo_text[first].name;
            first = logo_text[first].next;
            num -= 1;
        }
        
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
            Show_Sunbursts_all['up']['show_group_by'] = Show_Sunbursts_all['down']['show_group_by'];
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
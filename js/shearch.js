// open the Shakespeare poems database
// then, if necessary, insert poems into the poems table
var db = openDatabase('poems', '1.0', 'Poems', 2 * 1024 * 1024); // short name, version, display name, max size (made-up number...)
// if transaction is successful insert poems into table
db.transaction(function (tx) {
    tx.executeSql('DROP TABLE IF EXISTS poems');
    tx.executeSql('CREATE TABLE IF NOT EXISTS poems (poemIndex varchar(6), poemTitle varchar(255), lineNumber varchar(2), lineText varchar(255))',  
		[], null, queryErrorHandler); 
}, transactionErrorHandler, insertPoems);

// poems object is defined in poems.json
function insertPoems() {
    db.transaction(function(tx){
        // for each poem
        $.each(poems, function(poemIndex, poem) {
            // for each line
            $.each(poem.lines, function(lineIndex, lineText) {
                // insert row with poem number, line number and line text
                tx.executeSql('INSERT INTO poems (poemIndex, poemTitle, lineNumber, lineText) VALUES (?, ?, ?, ?)',
                    [poemIndex.toString(), poem.title, (lineIndex + 1).toString(), lineText]);
            });
        });
    }, transactionErrorHandler, null);
}

function insertPoemsTest() {
    db.transaction(function(tx){
        for (var i = 0; i != 20000; ++i) {
            tx.executeSql('INSERT INTO poems (poemIndex, poemTitle, lineNumber, lineText) VALUES (?, ?, ?, ?)',
                [i, "Sonnet 154", (i % 14), "Shall I compare thee to a summer day?"]);
        }
    }, transactionErrorHandler, showCount);
}

function showCount() {
    var statement = "SELECT COUNT(*) FROM poems";
    doReadQuery(statement, showResults);
}


function elapsedTimer() {
    if (elapsedTimer.isStarted) {
        console.log("Elapsed: " + (Date.now() - elapsedTimer.startTime));
        elapsedTimer.isStarted = false;
    } else {
        elapsedTimer.startTime = Date.now();
        elapsedTimer.isStarted = true;
    }
}

// toggle display of poem or query results
function addClickHandler(poemDiv, linesDiv, poemIndex, query) {
	var isUnexpanded = true;
    var expandedHTML, unexpandedHTML; // to cache 'unexpanded' query results and 'expanded' whole poem
    poemDiv.click(function() {
		if (isUnexpanded) { // only query result lines are displayed: show whole poem
			unexpandedHTML = $(this).html();
			if (expandedHTML) { // if not the first time...
				$(this).html(expandedHTML);
			} else {
				linesDiv.html("");
				var poem = poems[poemIndex];
				poem.lines.forEach(function(line, index, lines){
					var lineDiv = $("<div class='line' />");
					lineDiv.append("<div class='lineText'>" + line.replace(new RegExp("(" + query + ")", "gi"), "<em>$1</em>") + "</div>");
					var lineNumber = index + 1;
					if (lineNumber % 5 === 0) {
						lineDiv.append("<div class='lineNumber'>" + lineNumber + "</div>");
					}
					linesDiv.append(lineDiv);
				});		
			}
			
			isUnexpanded = false;
		} else { // whole poem is shown: display only query result lines
			expandedHTML = $(this).html();
			$(this).html(unexpandedHTML);
			isUnexpanded = true;
		}
    });
}

function displayResults(transaction, results) {
//    elapsedTimer();
    var resultsDiv = $("<div class='results' />"); //
	var poemDiv, linesDiv;
	displayResults.currentPoemIndex = null;
    for (var i = 0; i !== results.rows.length; ++i) {
        var line = results.rows.item(i);
		// for each poem, create divs and add the poem title, then add a click handler to toggle display of the whole poem
		if (!displayResults.currentPoemIndex || displayResults.currentPoemIndex != line.poemIndex) {
			displayResults.currentPoemIndex = line.poemIndex;
			poemDiv = $("<div class='poem' />");
			poemDiv.append("<div class='poemTitle'>" + line.poemTitle + "</div>");			
			resultsDiv.append(poemDiv);
			linesDiv = $("<div class='lines' />").attr("poemIndex", line.poemIndex); // attr used to get html in click handler
			poemDiv.append(linesDiv);
			addClickHandler(poemDiv, linesDiv, line.poemIndex, query);
		}
		// add line to div.lines
		linesDiv.append("<div class='line'><div class='lineText'>" + 
			line.lineText.replace(new RegExp("(" + query + ")", "gi"), "<em>$1</em>") + 
			"</div><div class='lineNumber'>" + line.lineNumber + "</div></div>");       
    }
//	$("body").css("background-image", "url('images/background.jpg')");
    $("#resultsContainer").html(resultsDiv);
//    elapsedTimer();
}

var query;
$(document).ready(function() {
//    $("#query").focus(); // done with input autofocus attribute
    $("#query").bind('input', function() {
        query = $(this).val();
        if (query.length < 3) {
			$("#resultsContainer").empty();			
            return false;
        }
//        console.log(query);
        // could use caching of results for query
        var statement = "SELECT poemIndex, poemTitle, lineNumber, lineText FROM poems WHERE lineText like '%" + escape(query) + "%'";
        doReadQuery(statement, displayResults);
    });
});

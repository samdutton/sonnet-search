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
		var i;
        for (i = 0; i !== 20000; ++i) {
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
		if (isUnexpanded) { // if only query results are shown, display whole poem
			poemDiv.attr("title", "Click to display a facsimile of the sonnet");
			unexpandedHTML = $(this).html();
			if (expandedHTML) { // if not the first time...
				$(this).html(expandedHTML);
			} else {
				linesDiv.html("");
				var poem = poems[poemIndex];
				poem.lines.forEach(function(line, index, lines){
					var lineDiv = $("<div class='line' />");
					lineDiv.append("<div class='lineText'>" +
						line.replace(new RegExp("(" + query + ")", "gi"), "<mark>$1</mark>") + "</div>");
					var lineNumber = index + 1;
					if (lineNumber % 5 === 0) {
						lineDiv.append("<div class='lineNumber'>" + lineNumber + "</div>");
					}
					linesDiv.append(lineDiv);
				});
			}

			isUnexpanded = false;
		} else { // whole poem is shown: display only query result lines
			var sonnetNumber = parseInt(poemIndex, 10) + 1;
			window.open("http://internetshakespeare.uvic.ca/Library/facsimile/bookplay/UC_Q1_Son/Son/" +
				sonnetNumber + "/?zoom=5");
//			expandedHTML = $(this).html();
//			$(this).html(unexpandedHTML);
//			isUnexpanded = true;
		}
    });
}

function addDoubleClickHandler(poemDiv, sonnetNumber){
    poemDiv.dblclick(function(){
		window.open("http://internetshakespeare.uvic.ca/Library/facsimile/bookplay/UC_Q1_Son/Son/" + sonnetNumber + "/?zoom=5");
	});
}

function displayResults(transaction, results) {
//    elapsedTimer();
	if (!query) { // !!!hack: to cope with inputting long query then quickly deleting
		return;
	}
    var resultsDiv = $("<div class='results' />"); //
	var currentPoemIndex, poemDiv, linesDiv;
	var i;
    for (i = 0; i !== results.rows.length; ++i) {
        var line = results.rows.item(i);
		// for each new poem (i.e. new currentPoemIndex)
		// create divs and add the poem title,
		// then add a click handler to toggle display of the whole poem
		if (!currentPoemIndex || currentPoemIndex !== line.poemIndex) {
			currentPoemIndex = line.poemIndex;
			poemDiv = $("<div class='poem' title='Click to display the whole sonnet' />");
			poemDiv.append("<div class='poemTitle'>" + line.poemTitle + "</div>");
			resultsDiv.append(poemDiv);
			linesDiv = $("<div class='lines' />").attr("poemIndex", line.poemIndex); // attr used to get html in click handler
			poemDiv.append(linesDiv);
			addClickHandler(poemDiv, linesDiv, line.poemIndex, query);
		}
		// add line to div.lines
		linesDiv.append("<div class='line'><div class='lineText'>" + line.lineText +
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
        if (query.length < 2) {
			$("#resultsContainer").empty();
            return false;
        }
		// console.log(query);
        // could use caching of results for query -- and does not cope with pathological input, such as double quotes
        var statement = 'SELECT poemIndex, poemTitle, lineNumber, lineText FROM poems WHERE lineText like "%' + query + '%"';
        doReadQuery(statement, displayResults);
    });
});

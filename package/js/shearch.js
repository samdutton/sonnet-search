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
    }, transactionErrorHandler, showCount);
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

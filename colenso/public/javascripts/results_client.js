
// Replace <title> with <teititle> to prevent conflict with HTML <title>
$("body tei teiheader filedesc titlestmt title").replaceWith('<teititle>' +
 $('body tei teiheader filedesc titlestmt title').html() +'</teititle>');

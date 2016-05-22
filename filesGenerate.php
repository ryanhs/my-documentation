<?php

$data  = [];

$pathLvl1 = 'files/';
$dLvl1 = scandir($pathLvl1);
foreach($dLvl1 as $entry) {
	if ($entry == '.') continue;
	if ($entry == '..') continue;
	
	if (is_dir($pathLvl1 . $entry)) {	
		$new = ['title' => $entry, 'data' => []];
					
		$pathLvl2 = $pathLvl1 . $entry . '/';
		$dLvl2 = scandir($pathLvl2);
		foreach($dLvl2 as $entry) {
			if ($entry == '.') continue;
			if ($entry == '..') continue;
			
			if(substr($entry, -2) == 'md') {
				$new['data'][] = [
					'src' => $pathLvl2 . $entry,
					'type' => 'markdown',
					'name' => formatAlias(substr($entry, 0, -3))
				];
			}
			
			if(substr($entry, -4) == 'html') {
				$new['data'][] = [
					'src' => $pathLvl2 . $entry,
					'type' => 'html',
					'name' => formatAlias(substr($entry, 0, -5))
				];
			}
			
			if(in_array(substr($entry, -3), explode(',', 'jpg,gif,png'))) {
			//~ if(substr($entry, -3) == 'jpg' || substr($entry, -3) == 'png' || substr($entry, -3) == 'gif') {
				$new['data'][] = [
					'src' => $pathLvl2 . $entry,
					'type' => 'image',
					'name' => formatAlias(substr($entry, 0, -4))
				];
			}
		}
		$data[] = $new;
	}
}

$out = json_encode($data, JSON_PRETTY_PRINT);
file_put_contents('files/repo.json', $out);
echo $out . PHP_EOL;


function formatAlias($str){
	return ucwords(str_replace('_', ' ', $str));
}

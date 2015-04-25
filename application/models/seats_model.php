<?php
/*
 * Created on 2015-3-21
 * 座位模型，与座位有关的所有数据库操作
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */
?>
<?php

	class Seats_model extends CI_Model{ 
		
		//构造方法
		function __construct(){
			parent::__construct();
			$this->load->database();
		}
		
		//接受数据并插入数据
		public function getSeatsInfo(){
			//插入数据
			$sql = "select * from seats";
			$result = $this->db->query($sql);
			return $result->result_array();
		}
		
		//获取不可选的座位信息
		public function getUnUseSeats(){
			$seatsSaled = $this->getSeatsSaled();
			$time = time();
			$sql = "select * from orders where state = 1 or (state=0 and fail_time > '$time') ";
			$result = $this->db->query($sql)->result_array();
			//从订单表中获取到的当前不可选的座位代号
			$sidOrderd = array();
			$i = 0;
			foreach($result as $item){
				$sids = unserialize($item['sid']);
				//如果订单支付成功，或者支付未成功但是订单还未过期
				//判断sids存在
				if($sids){
					foreach($sids as $sid){
						$sidOrderd[$i] = $sid;
						$i++;
					}
				}
			}
			//和order表中的数据合并
			foreach($sidOrderd as $sid){
				if(!in_array($sid,$seatsSaled)){
					$seatsSaled[count($seatsSaled)] = $sid;
				}
			}
			//返回不可选的座位信息
			return $seatsSaled;
		}
		
		//从seats表中获取已经购买的座位信息
		public function getSeatsSaled(){
			$sidSql = "select sid from seats where state = 1";
			$result = $this->db->query($sidSql)->result_array();
			$res = array();
			$i = 0;
			foreach($result as $item){
				$res[$i] = $item['sid'];
				$i++;
			}
			return $res;
		}
		
		
		//往数据库插入座位，仅供测试使用，危险！
		private function addSeats(){
			$count=0;
			for($i=1;$i<=20;$i++){
				for($j=1;$j<=25;$j++){
					$count++;
					if($i<=4) 
						$rank=1;
					else 
						$rank=2;
					$sql="insert into seats(sid,rank,row,col,state) values(".$count.",".$rank.",".$i.",".$j.",0)";
					$result = $this->db->query($sql);
					echo "第".$count."条,录入".$result==0?"失败":"成功";
				}
			}
		}
		
		//更新座位信息，支付成功后,座位被锁定,不可售
		public function updateInfo($oid){
			$seatSql = "select sid from orders where oid = '$oid'";
			$seatResult = $this->db->query($seatSql);
			$seats;
			foreach($seatResult->result_array() as $seatItem){
				$seats = unserialize($seatItem['sid']);				
			}
			$sql = "update seats set state = 1 where sid = ";
			$count = count($seats);
			for($i=0;$i<$count;$i++){
				$updateSql = $sql.$seats[$i];
				$this->db->query($updateSql);
			}
		}
		
		//获得座位总价
		public function getTotalFee($seats){
			$totalFee = 0;
			$sql = "select rank from seats where sid = ";
			foreach($seats as $seat){
				$priceSql = $sql.$seat;
				$result = mysql_query($priceSql);
				while($rank = mysql_fetch_array($result)){
					switch($rank['rank']){
					case 1:
						$totalFee += 0.01;
						break;
					case 2:
						$totalFee += 0.01;
						break;
					case 3:
						$totalFee += 0.01;
						break;
					}
				}
			}
			return $totalFee;
		}
		
		public function judgeSeat($seats){
			$result = true;
			$sql = "select state from seats where sid = ";
			foreach($seats as $seat){
				$stateSql = $sql.$seat; 
				$result = mysql_query($stateSql);
				while($state = mysql_fetch_array($result)){
					if($state['state'] == 1){
						$result = false;
						return $result;
					}
				}
			}
			return $result;
		}
	}

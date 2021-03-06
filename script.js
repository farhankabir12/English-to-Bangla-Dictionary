const dictionaryDatabaseLink = 'https://raw.githubusercontent.com/MinhasKamal/BengaliDictionary/master/BengaliDictionary.json';
const RADIX = 256;
const PRIME = 908209935089;
var initialVariableA = null;
var initialVariableB = null;
var NOS;
var dictionary;		//number of words in dictionary
var data;
const primeArray = [1, 2, 5, 11, 17, 29, 37, 53, 67]; //array of next highest prime greater than sqauare of index
var tempHashTable = new Array();
var maxKey = -1;
var hashTable = new Array();
var hashtable1Indicator;
var hashTable2Indicator = new Array();


window.onload = function initializeHashing(){
	console.log('Data Received');
	    data = fetch(dictionaryDatabaseLink)
	        .then(response => {
	            if(!response.ok){
	                throw new Error("HTTP error " + response.status);
	            }
	            return response.json()
	        })
	        .then(json => {
	            dictionary = json;
	        	NOS = Object.keys(dictionary).length;
	        })
	        .then(response => {
	        	hashtable1Indicator = new Array(NOS).fill(0);
	        	for(var i = 0; i < NOS; i++) {
					hashTable[i] = new Array(80).fill(null);
					tempHashTable[i] = new Array(80).fill(null);
					hashTable2Indicator[i] =new Array(5).fill(-1);
					hashTable[i][0] = null;
				}

				for(var i = 0; i < NOS; i++){
					var word = dictionary[i].en.toLowerCase();
					var key = primaryHash(convertWordToKey(word));
					maxKey = Math.max(key, maxKey);
					if(hashtable1Indicator[key] == 0){
						hashTable[key][0] = dictionary[i];
						tempHashTable[key][0] = dictionary[i];
						hashtable1Indicator[key] = 1;
					}
					else{
						tempHashTable[key][hashtable1Indicator[key]++] = dictionary[i];
					}
				}
				for(var i = 0; i <= maxKey; i++){

					if(hashtable1Indicator[i] != 0){
							var result = secondaryHash(i, tempHashTable[i]);
							hashTable[i] = result[0];
							hashTable2Indicator[i] = result[1];
						}
				}
	        });
}




function convertWordToKey(word){
        var val = 0;
        var a = Math.floor(Math.random() * (PRIME - 1) ) + 1;
        var b = Math.floor(Math.random() * PRIME);
        if(initialVariableA == null || initialVariableB == null){
            initialVariableA = a;
            initialVariableB = b;
        }
        else{
            a = initialVariableA;
            b = initialVariableB;
        }
        for(var i=0; i<word.length; i++){
            val = ( (val*RADIX) % PRIME + word.charCodeAt(i) ) % PRIME;
        }
        const aB = BigInt(a*val + b);
        const out = aB % BigInt(PRIME);

        return Number(out);
    }

 function primaryHash(number){
	return number % NOS;
}

function secondaryHash(key, tempHashArray){
	var set = false;
	var finalArray;
	while(!set){
		finalArray = new Array(80).fill(null);
		var secondaryHashArray = new Array(3).fill(-1);
		var a = BigInt(Math.floor(Math.random() * (PRIME - 1) ) + 1);
		var b = BigInt(Math.floor(Math.random() * PRIME));
		for(var i = 0; i < hashtable1Indicator[key]; i++){
			var pos = BigInt((a * BigInt(key) + b) % BigInt(primeArray[hashtable1Indicator[key]]));
			if(finalArray[pos] == null){
				finalArray[pos] = tempHashArray[i];
				secondaryHashArray = [a, b , BigInt(primeArray[hashtable1Indicator[key]])];
				if(i + 1 == hashtable1Indicator[key]) set = true;
			}
			else if(tempHashArray[i].en === finalArray[pos].en){
				if(i + 1 == hashtable1Indicator[key]) set = true;
				continue;
			}
			else break;
		}
		return[
			finalArray, secondaryHashArray
		];
	}
}

function search(){
    var input = document.getElementById('query');
    var word = input.value.toLowerCase();
    var output1 = document.getElementById('output1');
	var output2 = document.getElementById('output2');
	var output3 = document.getElementById('output3');
	var output4 = document.getElementById('output4');
	var output5 = document.getElementById('output5');
    var key = primaryHash(convertWordToKey(word));
    var sHash;

    try{
        if(hashtable1Indicator[key] == 0){
            throw 'Word Not Found';
        }

        const a = hashTable2Indicator[key][0];
        const b = hashTable2Indicator[key][1];
        const c = hashTable2Indicator[key][2];

        sHash = BigInt((a * BigInt(key) + b) % BigInt(primeArray[hashtable1Indicator[key]]));

        if(hashTable[key][sHash] != null &&
            hashTable[key][sHash].en == word){
            output1.innerHTML = hashTable[key][sHash].pron;
			output2.innerHTML = hashTable[key][sHash].bn;
			output3.innerHTML = hashTable[key][sHash].bn_syns;
			output4.innerHTML = hashTable[key][sHash].en_syns;
			output5.innerHTML = hashTable[key][sHash].sents;
        }
        else{
            throw 'Word Not Found';
        }
    }catch(err){
        console.log(err);
        output.innerHTML = '';
    };

}

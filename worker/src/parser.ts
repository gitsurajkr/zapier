export function parse(text: string, value: any, startDelimeter="{", endDelimeter="}"){
    let startIndex = 0;
    let endIndex = 0

    let finalString = "";
    while(endIndex < text.length){
        if(text  [startIndex] === startDelimeter) {
            
            let endPoint = startIndex+2;
            while(text[endPoint] !== endDelimeter) {
                endPoint++;
            }

            let stringHoldingValue = text.slice(startIndex + 1, endPoint)
            const keys = stringHoldingValue.split(".");
            let localValue = {
                ...value
            }

            for(let i = 0; i < keys.length; i++){
                if(typeof localValue === "string"){
                    localValue = JSON.parse(localValue);
                }
                localValue = localValue[keys[i]]
            }
            finalString += localValue;

            startIndex = endPoint+1;
            endIndex = endPoint+2;
        } else {
            finalString += text[startIndex]
            startIndex++;
            endIndex++;
        }
    }

    if(text[startIndex]){
        finalString+= text[startIndex]
    }

    return finalString;
}

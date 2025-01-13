import { Dimensions } from "react-native";

const {width:deviceWidth,height:deviceHeight} = Dimensions.get("window");

export const hp = (percent) => {
    return (percent * deviceHeight) / 100;
}

export const wp = (percent) => {
    return (percent * deviceWidth) / 100;
}
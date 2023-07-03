import $ from '../../in.mjs';
import * as fs from "fs";
import * from "tables";

const t = $('../../2022/IN/12');
console.log(mapAll(t, (x) => '#'));
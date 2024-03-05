// this prompt cannot be formatted, any tabs will cause the response to break
export const promptFormat = (top: string, end: string): string => `<｜begin▁of▁sentence｜>
### Instruct:<｜fim_begin｜>
${top}<｜fim_hole｜>
${end}<｜fim_end｜>
<｜end▁of▁sentence｜>
### Response:<｜EOT｜>
`;
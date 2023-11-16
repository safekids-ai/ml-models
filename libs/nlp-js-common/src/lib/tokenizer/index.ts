import {BertTokenizer} from './tokenizer'

class Tokenizer {
    private readonly tokenizer: BertTokenizer
    constructor () {
        this.tokenizer = new BertTokenizer('legacy', true);
    }

    public async tokenize(texts: string[], maxInputLength=48) {
        var all_encoded = new Array()
        var encoded_lengths = new Array<number>()
        texts.forEach(text => {all_encoded.push(this.tokenizer.tokenize(text).slice(0, maxInputLength))})
        all_encoded.forEach(encoded => {encoded_lengths.push(encoded.length)})

        maxInputLength = Math.min(Math.max.apply(Math, encoded_lengths), maxInputLength)

        var input_ids = new Array(all_encoded.length * (maxInputLength + 2));
        var attention_mask = new Array(all_encoded.length * (maxInputLength + 2));
        var token_type_ids = new Array(all_encoded.length * (maxInputLength + 2));

        var string_i = 0
        var current_index = 0

        for (string_i; string_i < all_encoded.length; string_i++) {
          input_ids[current_index] = BigInt(101);
          attention_mask[current_index] = BigInt(1);
          token_type_ids[current_index] = BigInt(0);

          current_index += 1

          for(var i=0; i < all_encoded[string_i].length; i++) {
            input_ids[current_index] = BigInt(all_encoded[string_i][i]);
            attention_mask[current_index] = BigInt(1);
            token_type_ids[current_index] = BigInt(0);
            current_index += 1
          }

          input_ids[current_index] = BigInt(102);
          attention_mask[current_index] = BigInt(1);
          token_type_ids[current_index] = BigInt(0);
          current_index += 1

          for (var i=0; i < maxInputLength - all_encoded[string_i].length; i++) {
            input_ids[current_index] = BigInt(0);
            attention_mask[current_index] = BigInt(0);
            token_type_ids[current_index] = BigInt(0);
            current_index += 1
          }
        }

        return [BigInt64Array.from(input_ids), BigInt64Array.from(attention_mask), BigInt64Array.from(token_type_ids), all_encoded.length, maxInputLength];

    }

}

export { Tokenizer }

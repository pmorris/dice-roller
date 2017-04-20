const request = require('request');


var request_options = {
    url: 'https://www.random.org/dice/?num=10',
    timeout: 4000
}

var result_options = {
    url: 'https://requestb.in/u99y2xu9',
    timeout: 4000
}

request.get(request_options, function(error, response, body) {

    if (error) {
        console.log(error);
        return;
    }

    if (response.statusCode == 200) {
        matches = body.match(/dice[1-6]\.png/g);
        body = null;

        result_counts = [0,0,0,0,0,0];

        while(roll = matches.shift()) {
            num = roll[4];

            // increment the count for this roll
            result_counts[parseInt(num) - 1] += 1;

        }

        // output
        aggregate_out = '';
        sequence_out = [];
        for(i=0; i<result_counts.length; i++) {
            aggregate_out += i+1 + '->' + result_counts[i] + '\n';

            for (n=0; n<result_counts[i]; n++) {
                sequence_out.push(i+1);
                // sequence_json.dice.push(i+1);
            }

        }
        console.log(aggregate_out);
        console.error(sequence_out.join(' '));

        post_json_sequence(sequence_out);

    } else {
        console.log(error);
    }
});


function post_json_sequence(dice_sequence) {

    request.post({
        url: result_options.url,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ 'dice': dice_sequence })
    });
}

/**
 *  Services for handling GitHub API from stack overflow https://stackoverflow.com/a/59042992
 */

export async function getContributions() {
    
  var data = await (await fetch(`https://corsanywhere.herokuapp.com/https://github-contributions-api.deno.dev/nicobrown.json`)).json();
  
    return data;
  }



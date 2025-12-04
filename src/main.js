import './style.css'

async function main() {

  const STORY_ID = '4961e406d6364e198c71cdf3de491285';

  // Create and insert the embed script manually
  const s = document.createElement('script');
  s.src = "https://storymaps.arcgis.com/embed/view";
  s.setAttribute("data-story-id", STORY_ID);
  s.setAttribute("data-root-node", ".storymaps-root");
  document.body.appendChild(s);

}

main();

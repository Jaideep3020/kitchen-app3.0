with open('src/components/StudentOptIn.tsx', 'r') as f:
    content = f.read()

content = content.replace("        </div>\n\n      {/* Staples Alert Strip */}", "        </ScrollAffordance>\n\n      {/* Staples Alert Strip */}")
content = content.replace("        </div>\n\n        {/* Staples Alert Strip */}", "        </ScrollAffordance>\n\n        {/* Staples Alert Strip */}")
content = content.replace("      </div>\n\n      {/* Staples Alert Strip */}", "      </ScrollAffordance>\n\n      {/* Staples Alert Strip */}")
content = content.replace("      </div>\n\n      {/* Staples Alert Strip */}", "      </ScrollAffordance>\n\n      {/* Staples Alert Strip */}")
content = content.replace("          </div>\n\n          {/* Staples Alert Strip */}", "          </ScrollAffordance>\n\n          {/* Staples Alert Strip */}")

# A more robust regex just in case
import re
content = re.sub(r'</div>\s*\{/\* Staples Alert Strip \*/\}', r'</ScrollAffordance>\n\n {/* Staples Alert Strip */}', content)

with open('src/components/StudentOptIn.tsx', 'w') as f:
    f.write(content)

import React from 'react'
import { ScrollArea } from "./ui/scroll-area"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"

const FilterSidebar = ({ filters, updateFilters }) => {
  const difficulties = ['Easy', 'Medium', 'Hard']
  const skills = ['SQL (Basic)', 'SQL (Intermediate)', 'SQL (Advanced)']
  const subdomains = [
    'Basic Select',
    'Advanced Select',
    'Aggregation',
    'Basic Join',
    'Advanced Join',
    'Alternative Queries'
  ]

  return (
    <aside className="w-80 flex-shrink-0 p-6 border-l dark:border-gray-800">
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="solved"
                  checked={filters.status === 'solved'}
                  onCheckedChange={() => updateFilters('status', 'solved')}
                />
                <Label htmlFor="solved">Solved</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="unsolved"
                  checked={filters.status === 'unsolved'}
                  onCheckedChange={() => updateFilters('status', 'unsolved')}
                />
                <Label htmlFor="unsolved">Unsolved</Label>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Skills</h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox 
                    id={skill}
                    checked={filters.skills.includes(skill)}
                    onCheckedChange={(checked) => {
                      updateFilters('skills', checked
                        ? [...filters.skills, skill]
                        : filters.skills.filter(s => s !== skill)
                      )
                    }}
                  />
                  <Label htmlFor={skill}>{skill}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Difficulty</h3>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <Checkbox 
                    id={difficulty}
                    checked={filters.difficulty.includes(difficulty)}
                    onCheckedChange={(checked) => {
                      updateFilters('difficulty', checked
                        ? [...filters.difficulty, difficulty]
                        : filters.difficulty.filter(d => d !== difficulty)
                      )
                    }}
                  />
                  <Label htmlFor={difficulty}>{difficulty}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Subdomains</h3>
            <div className="space-y-2">
              {subdomains.map((subdomain) => (
                <div key={subdomain} className="flex items-center space-x-2">
                  <Checkbox 
                    id={subdomain}
                    checked={filters.subdomains.includes(subdomain)}
                    onCheckedChange={(checked) => {
                      updateFilters('subdomains', checked
                        ? [...filters.subdomains, subdomain]
                        : filters.subdomains.filter(s => s !== subdomain)
                      )
                    }}
                  />
                  <Label htmlFor={subdomain}>{subdomain}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

export default FilterSidebar


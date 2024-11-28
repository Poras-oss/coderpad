import React from 'react'
import { Drawer } from 'vaul'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { ScrollArea } from "./ui/scroll-area"

const FilterDrawer = ({ isOpen, onClose, filters, updateFilters }) => {
  const difficulties = ['Easy', 'Medium', 'Advance']
  const subtopics = ['Joins', 'Subqueries', 'Aggregations', 'Window Functions']
  const companies = ['Amazon', 'Google', 'Microsoft', 'Facebook', 'Apple']

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white dark:bg-gray-800 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-t-[10px] flex-1 overflow-auto">
            <Drawer.Title className="font-medium mb-4 text-lg">Filters</Drawer.Title>
            <ScrollArea className="h-full pr-4">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Difficulty</CardTitle>
                </CardHeader>
                <CardContent>
                  {difficulties.map((difficulty) => (
                    <div key={difficulty} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`difficulty-${difficulty}`}
                        checked={filters.difficulties.includes(difficulty.toLowerCase())}
                        onCheckedChange={(checked) => {
                          updateFilters('difficulties', checked
                            ? [...filters.difficulties, difficulty.toLowerCase()]
                            : filters.difficulties.filter(d => d !== difficulty.toLowerCase())
                          )
                        }}
                      />
                      <label
                        htmlFor={`difficulty-${difficulty}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {difficulty}
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Subtopics</CardTitle>
                </CardHeader>
                <CardContent>
                  {subtopics.map((subtopic) => (
                    <div key={subtopic} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`subtopic-${subtopic}`}
                        checked={filters.subtopics.includes(subtopic)}
                        onCheckedChange={(checked) => {
                          updateFilters('subtopics', checked
                            ? [...filters.subtopics, subtopic]
                            : filters.subtopics.filter(s => s !== subtopic)
                          )
                        }}
                      />
                      <label
                        htmlFor={`subtopic-${subtopic}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {subtopic}
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  {companies.map((company) => (
                    <div key={company} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`company-${company}`}
                        checked={filters.companies.includes(company)}
                        onCheckedChange={(checked) => {
                          updateFilters('companies', checked
                            ? [...filters.companies, company]
                            : filters.companies.filter(c => c !== company)
                          )
                        }}
                      />
                      <label
                        htmlFor={`company-${company}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {company}
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Other Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-bookmarked"
                      checked={filters.bookmarked}
                      onCheckedChange={(checked) => updateFilters('bookmarked', checked)}
                    />
                    <label
                      htmlFor="show-bookmarked"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show Bookmarked Only
                    </label>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default FilterDrawer


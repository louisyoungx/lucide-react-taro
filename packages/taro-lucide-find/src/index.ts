#!/usr/bin/env node
import { Command } from 'commander'
import Fuse from 'fuse.js'
import { iconList } from './icon-list'

const program = new Command()

program
    .name('taro-lucide-find')
    .description('Find Lucide icon names with exact match, fuzzy suggestions, list output, and JSON mode')
    .argument('[queries...]', 'Search queries')
    .option('-e, --exact', 'Exact match only')
    .option('-l, --list', 'List all icons')
    .option('-j, --json', 'Output results in JSON format')
    .action((queries, options) => {
        // If user explicitly asks for list or no query provided (and not exact search)
        if (options.list) {
            if (options.json) {
                console.log(
                    JSON.stringify(
                        iconList.map(i => i.componentName),
                        null,
                        2,
                    ),
                )
            } else {
                console.log(iconList.map(i => i.componentName).join('\n'))
            }
            return
        }

        if (!queries || queries.length === 0) {
            // If no query and no list option, show help
            program.help()
            return
        }

        // Initialize Fuse for search
        const fuse = new Fuse(iconList, {
            keys: ['name', 'componentName'],
            threshold: 0.4, // Match sensitivity (0.0 = exact, 1.0 = anything)
            distance: 100, // Distance for relevance
            minMatchCharLength: 2,
            shouldSort: true, // Sort by score
        })

        const processQuery = (
            query: string,
        ): { found: boolean; matches: string[]; exactMatch?: string } => {
            // Check for exact match first (case-insensitive)
            const exactMatch = iconList.find(
                i =>
                    i.name.toLowerCase() === query.toLowerCase() ||
                    i.componentName.toLowerCase() === query.toLowerCase(),
            )

            if (exactMatch) {
                return {
                    found: true,
                    matches: [exactMatch.componentName],
                    exactMatch: exactMatch.componentName,
                }
            }

            if (options.exact) {
                return { found: false, matches: [] }
            }

            // Fuzzy search using Fuse.js
            const fuzzyResults = fuse.search(query)
            let results = fuzzyResults.map(result => result.item.componentName)

            // Special handling for short queries (like "arrow") to avoid noise
            if (query.length > 2) {
                const substringMatches = iconList
                    .filter(
                        i =>
                            i.name
                                .toLowerCase()
                                .includes(query.toLowerCase()) ||
                            i.componentName
                                .toLowerCase()
                                .includes(query.toLowerCase()),
                    )
                    .map(i => i.componentName)

                // If we found substring matches, use them instead of fuzzy results
                if (substringMatches.length > 0) {
                    results = substringMatches
                }
            }

            // If we have no results yet, use fuzzy results as suggestions
            if (results.length === 0 && fuzzyResults.length > 0) {
                results = fuzzyResults.map(r => r.item.componentName)
            }

            return { found: results.length > 0, matches: results }
        }

        // If JSON output is requested or multiple queries are provided, use structured output
        if (options.json || queries.length > 1) {
            const output = queries.map((q: string) => {
                const result = processQuery(q)
                return {
                    query: q,
                    exists: !!result.exactMatch, // True only if we found an exact match
                    name: result.exactMatch || null, // The correct component name if exists
                    suggestions: result.exactMatch
                        ? []
                        : result.matches.slice(0, 5), // Top 5 suggestions if not found
                }
            })

            if (options.json) {
                console.log(JSON.stringify(output, null, 2))
            } else {
                // Human-readable output for multiple queries
                output.forEach((item: any) => {
                    if (item.exists) {
                        if (item.query === item.name) {
                            console.log(`✅ ${item.name}`)
                        } else {
                            console.log(`✅ ${item.query} -> ${item.name}`)
                        }
                    } else {
                        console.log(`❌ ${item.query} not found.`)
                        if (item.suggestions.length > 0) {
                            console.log(
                                `   Did you mean: ${item.suggestions.join(', ')}?`,
                            )
                        }
                    }
                })
            }
        } else {
            // Single query, non-JSON mode (Legacy behavior)
            const query = queries[0]
            const result = processQuery(query)

            if (result.matches.length === 0) {
                console.log('No icons found.')
            } else {
                console.log(result.matches.join('\n'))
            }
        }
    })

program.parse()

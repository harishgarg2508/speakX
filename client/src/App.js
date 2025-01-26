import React, { useState, useCallback, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

import { 
    Container, 
    TextField, 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    CircularProgress, 
    Autocomplete,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    Paper,
    Chip
} from '@mui/material';
import debounce from 'lodash/debounce';

// MCQ Display 

const theme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: 'linear-gradient(45deg,rgb(190, 128, 35) 30%,rgb(61, 46, 107) 90%)',
            minHeight: '100vh',
          },
        },
      },
    },
  });

const typeColorMap = {
    MCQ: {
      background: '#FFEB3B',     // Bright Yellow
      border: '#FBC02D'          // Amber
    },
    ANAGRAM: {
      background: '#4FC3F7',     // Sky Blue
      border: '#0288D1'          // Deep Sky Blue
    },
    READ_ALONG: {
      background: '#81C784',     // Light Green
      border: '#388E3C'          // Forest Green
    },
    CONTENT_ONLY: {
      background: '#FF8A65',     // Coral
      border: '#D84315'          // Dark Orange
    }
  };
  
  
  
// MCQ Display Component
const MCQDisplay = ({ options = [] }) => {
  console.log('MCQ Options:', options); // Debug log
  
  return (
    
      <Box sx={{ mt: 2 }}>
          {options && options.length > 0 ? (
              <RadioGroup>
                  {options.map((option, index) => (
                      <FormControlLabel
                          key={index}
                          value={option.text}
                          control={
                              <Radio 
                                  disabled 
                                  checked={option.isCorrectAnswer}
                              />
                          }
                          label={
                              <Box
                                  sx={{
                                      p: 1,
                                      width: '100%',
                                      '&:hover': {
                                          bgcolor: 'action.hover',
                                      },
                                      ...(option.isCorrectAnswer && {
                                          bgcolor: 'success.light',
                                          borderRadius: 1,
                                      })
                                  }}
                              >
                                  {option.text}
                              </Box>
                          }
                          sx={{
                              margin: '8px 0',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid',
                              borderColor: 'divider',
                              width: '100%',
                          }}
                      />
                  ))}
              </RadioGroup>
          ) : (
              <Typography color="error">No options available</Typography>
          )}
      </Box>
  );
};

// Anagram Display Component
const AnagramDisplay = ({ blocks = [], anagramType = "", solution = "" }) => (
  <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {anagramType === "WORD" ? "Arrange the letters:" : "Arrange the words:"}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {blocks.map((block, index) => (
              <Paper
                  key={index}
                  elevation={2}
                  sx={{
                      p: 1,
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      cursor: 'move'
                  }}
              >
                  {block.text}
              </Paper>
          ))}
      </Box>
      {solution && (
          <Paper sx={{ p: 2, bgcolor: 'info.light', mt: 2 }}>
              <Typography variant="body2">
                  <strong>Solution:</strong> {solution}
              </Typography>
          </Paper>
      )}
  </Box>
);




function App() {
    // State declarations
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [questionTypes, setQuestionTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    // Fetch question types on component mount
    useEffect(() => {
        const fetchQuestionTypes = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/question-types');
                const data = await response.json();
                if (data.status === 'success') {
                    setQuestionTypes(data.types);
                }
            } catch (error) {
                console.error('Failed to fetch question types:', error);
            }
        };

        fetchQuestionTypes();
    }, []);

    // Search handler
    const handleSearch = useCallback(async (query, pageNum = 1) => {
        if (!query || query.trim() === '') {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                query: query,
                page: pageNum,
                limit: itemsPerPage,
                sortBy: sortBy,
                sortOrder: sortOrder,
                ...(selectedTypes.length && { types: selectedTypes.join(',') })
            });

            console.log('Search URL:', `http://localhost:3000/api/search?${queryParams}`);

            const response = await fetch(`http://localhost:3000/api/search?${queryParams}`);
            const data = await response.json();
            
            console.log('Raw Search Response:', data);

            if (data.status === 'success') {
                data.results.forEach(result => {
                    if (result.type === 'MCQ') {
                        console.log(`MCQ Question "${result.title}" options:`, result.options);
                    }
                });

                setResults(data.results);
                setTotalPages(data.pagination.totalPages);
                setPage(data.pagination.currentPage);
            } else {
                setError('Failed to fetch results');
            }
        } catch (error) {
            console.error('Search error:', error);
            setError('Failed to fetch results');
        } finally {
            setLoading(false);
        }
    }, [itemsPerPage, sortBy, sortOrder, selectedTypes]);

    // Event handlers
    const handlePageChange = (event, value) => {
        setPage(value);
        handleSearch(searchQuery, value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
        setPage(1);
        handleSearch(searchQuery, 1);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        handleSearch(searchQuery, page);
    };

    const handleSortOrderChange = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        handleSearch(searchQuery, page);
    };

    const handleTypeChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedTypes(typeof value === 'string' ? value.split(',') : value);
        setPage(1);
        handleSearch(searchQuery, 1);
    };

    const debouncedSearch = useCallback(
        debounce((query) => handleSearch(query, 1), 300),
        [handleSearch]
    );

    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setPage(1);
        debouncedSearch(query);
    };

    return (
        <ThemeProvider theme={theme}>
        
        <Container maxWidth="md">
            <Box sx={{  my: 4,  
                minHeight: '100vh',
                backgroundColor: 'rgba(160, 162, 162, 0.8)',
                borderRadius: 2,
                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
                p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Advanced Search
                </Typography>

                {/* Search Input */}
                <Autocomplete
                    freeSolo
                    options={suggestions.map(suggestion => suggestion.text)}
                    onInputChange={(_, newValue) => handleInputChange({ target: { value: newValue } })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label="Search"
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleInputChange}
                            sx={{ mb: 4 }}
                        />
                    )}
                />

                {/* Controls */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Question Types</InputLabel>
                            <Select
                                multiple
                                value={selectedTypes}
                                onChange={handleTypeChange}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {questionTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Items per page</InputLabel>
                            <Select
                                value={itemsPerPage}
                                label="Items per page"
                                onChange={handleItemsPerPageChange}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Sort by</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort by"
                                onChange={handleSortChange}
                            >
                                <MenuItem value="title">Title</MenuItem>
                                <MenuItem value="type">Type</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button 
                            fullWidth 
                            variant="outlined"
                            onClick={handleSortOrderChange}
                            sx={{ height: '100%' }}
                        >
                            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                        </Button>
                    </Grid>
                </Grid>

                {/* Loading Indicator */}
                {loading && (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Error Message */}
                {error && (
                    <Typography color="error" align="center" gutterBottom>
                        {error}
                    </Typography>
                )}

                {/* Results */}
                {results.map((result) => (
   <Card 
   key={result.id} 
   sx={{ 
       mb: 2,
       backgroundColor: typeColorMap[result.type]?.background || '#FFFFFF',
       borderLeft: `6px solid ${typeColorMap[result.type]?.border || '#grey'}`,
       '&:hover': {
           boxShadow: 6,
           transform: 'translateY(-2px)',
           transition: 'all 0.3s ease-in-out'
       }
   }}

    >
        <CardContent>
            <Typography variant="h6" component="h2">
                {result.title}
            </Typography>
            
            {/* Type-specific content */}
            {result.type === 'MCQ' && (
                <MCQDisplay options={result.options} />
            )}
            {result.type === 'ANAGRAM' && (
                <AnagramDisplay 
                    blocks={result.blocks}
                    anagramType={result.anagramType}
                    solution={result.solution}
                />
            )}
            {result.type === 'READ_ALONG' && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    {result.title}
                </Typography>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Chip 
                    label={`Type: ${result.type}`}
                    color={
                        result.type === 'MCQ' 
                            ? 'primary' 
                            : result.type === 'ANAGRAM'
                                ? 'secondary'
                                : 'default'
                    }
                    variant="outlined"
                    size="small"
                />
                {result.type === 'ANAGRAM' && (
                    <Chip 
                        label={result.anagramType}
                        color="info"
                        variant="outlined"
                        size="small"
                    />
                )}
            </Box>
        </CardContent>
    </Card>
))}
                {/* Pagination */}
                {totalPages > 1 && (
                    <Box display="flex" justifyContent="center" my={4}>
                        <Pagination 
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                )}

                {/* No Results Message */}
                {searchQuery && !loading && results.length === 0 && (
                    <Typography align="center">No results found</Typography>
                )}
            </Box>
        </Container>
        </ThemeProvider>
    );
}

export default App;
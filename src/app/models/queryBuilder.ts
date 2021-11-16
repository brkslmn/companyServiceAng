import { FragmentType } from "./query";
import { QueryFragment } from "./queryFragment";

const orderBy = require('lodash.orderby');

type filterType = string | number;

export default class FilterBuilder {
    private fragments: QueryFragment[] = [];

    filterExpression = (field: string, operator: string, word: filterType) => {
      this.fragments.push(
        new QueryFragment(FragmentType.Filter, `${field} ${operator} ${this.getValue(word)}`)
      );
      return this;
    };
    filterPhrase = (phrase: string) => {
        this.fragments.push(new QueryFragment(FragmentType.Filter, phrase));
        return this;
    };
    or = (predicate: (filter: FilterBuilder) => FilterBuilder) => {
      this.fragments.push(
        new QueryFragment(FragmentType.Filter, `(${predicate(new FilterBuilder()).Query('or')})`)
      );
      return this;
    };
    Query = (operator: string): string => {
      if (!this.fragments || this.fragments.length < 1) return '';
      return this.fragments.map(f => f.value).join(` ${operator} `);
    };
  
    private getValue(word: filterType): string {
      let type: string = typeof word;
      
  
      if (type === 'string') {
          return `'${word}'`;
      }else {
          return `${word}`;
      }
    }
}

export class QueryBuilder {
    fragments: QueryFragment[] = [];
   
    orderBy = (active: string, direct: string) => {
        this.clear(FragmentType.OrderBy);
        this.fragments.push(new QueryFragment(FragmentType.OrderBy, `$orderby=${active}${" "+direct}`));
        return this;
    }

    top = (top: number) => {
        this.clear(FragmentType.Top);
        this.fragments.push(new QueryFragment(FragmentType.Top, `$top=${top}`));
        return this;
    }

    skip = (skip: number) => {
        this.clear(FragmentType.Skip);
        this.fragments.push(new QueryFragment(FragmentType.Skip, `$skip=${skip}`));
        return this;
    }

    count = () => {
        this.clear(FragmentType.Count);
        this.fragments.push(new QueryFragment(FragmentType.Count, `$count=true`));
        return this;
    }

    filter = (predicate: (filter: FilterBuilder) => FilterBuilder, operator: string = 'or') => {
        this.clear(FragmentType.Filter);
        this.fragments.push(
          new QueryFragment(FragmentType.Filter, predicate(new FilterBuilder()).Query(operator))
        );
        return this;
    };

    clear = (fragmentType: FragmentType) => {
        this.fragments = this.fragments.filter(f => f.type !== fragmentType);
        
        return this;
    }

    Query = () => {
        if(this.fragments.length < 1){
            return '';
        };

        const sortedFragments = orderBy(this.fragments, (sf: QueryFragment) => sf.type);
        const nonFilterFragments = sortedFragments.filter((sf: QueryFragment) => sf.type !== FragmentType.Filter);
        const filterFragments = sortedFragments.filter((sf: QueryFragment) => sf.type === FragmentType.Filter);
        

        let query = '?' + sortedFragments .filter((sf: QueryFragment) => sf.type !== FragmentType.Filter)
                                          .map((sf: QueryFragment) => sf.value)
                                          .join('&');

        
                                          
        if (filterFragments.length < 1) return query;
        else if (nonFilterFragments.length > 0) query += '&';

        query += this.parseFilters(filterFragments, 'or').trim();

        return query;

    };

    private parseFilters(fragments: QueryFragment[], operator: string): string {
        if (!fragments === null || fragments.length < 1) return '';
        return '$filter=' + fragments.map(f => f.value).join(` ${operator} `);
     }
}